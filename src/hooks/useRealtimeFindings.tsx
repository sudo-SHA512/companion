import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuditFinding, AuditStatus, AuditState } from '@/types/audit';

interface RealtimeFindingPayload {
  audit_id: string;
  control_id: string;
  status: string;
  notes: string | null;
  evidence: string | null;
}

export const useRealtimeFindings = (
  auditId: string | undefined,
  onFindingChange: (controlId: string, finding: AuditFinding) => void
) => {
  useEffect(() => {
    if (!auditId) return;

    const channel = supabase
      .channel(`findings-${auditId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'audit_findings',
          filter: `audit_id=eq.${auditId}`
        },
        (payload) => {
          const data = payload.new as RealtimeFindingPayload;
          if (data) {
            onFindingChange(data.control_id, {
              status: data.status as AuditStatus,
              notes: data.notes || '',
              evidence: data.evidence || ''
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [auditId, onFindingChange]);
};

export const useRealtimeEvidenceFiles = (
  auditId: string | undefined,
  controlId: string,
  onFilesChange: () => void
) => {
  useEffect(() => {
    if (!auditId || !controlId) return;

    const channel = supabase
      .channel(`evidence-${auditId}-${controlId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'evidence_files',
          filter: `audit_id=eq.${auditId}`
        },
        (payload) => {
          const data = payload.new as { control_id?: string } | null;
          // Only refresh if the change is for this control
          if (data?.control_id === controlId || payload.eventType === 'DELETE') {
            onFilesChange();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [auditId, controlId, onFilesChange]);
};
