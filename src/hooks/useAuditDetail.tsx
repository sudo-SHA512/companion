import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { AuditState, AuditFinding, AuditStatus, Audit } from '@/types/audit';
import { SupportedLanguage } from '@/types/framework';
import { toast } from '@/hooks/use-toast';

export interface CreatorProfile {
  user_id: string;
  full_name: string | null;
  email?: string;
}

export const useAuditDetail = (auditId: string | undefined) => {
  const { user } = useAuth();
  const [audit, setAudit] = useState<Audit | null>(null);
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null);
  const [auditState, setAuditState] = useState<AuditState>({});
  const [loading, setLoading] = useState(true);

  // Fetch creator profile for an audit
  const fetchCreatorProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('user_id, full_name')
      .eq('user_id', userId)
      .maybeSingle();
    
    return data;
  }, []);

  // Log activity helper
  const logActivity = async (eventType: string, eventData: Record<string, string | number | boolean | null> = {}) => {
    if (!user || !auditId) return;
    
    await supabase
      .from('audit_activity_log')
      .insert([{
        audit_id: auditId,
        user_id: user.id,
        event_type: eventType,
        event_data: eventData
      }]);
  };

  // Load audit and findings
  const loadAudit = useCallback(async () => {
    if (!user || !auditId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch audit
      const { data: auditData, error: auditError } = await supabase
        .from('audits')
        .select('*')
        .eq('id', auditId)
        .single();

      if (auditError) throw auditError;
      
      const loadedAudit = auditData as Audit;
      setAudit(loadedAudit);

      // Fetch findings and creator profile in parallel
      const [findingsResult, creator] = await Promise.all([
        supabase
          .from('audit_findings')
          .select('*')
          .eq('audit_id', auditId),
        fetchCreatorProfile(loadedAudit.user_id)
      ]);

      if (findingsResult.error) throw findingsResult.error;

      const state: AuditState = {};
      findingsResult.data?.forEach((f) => {
        state[f.control_id] = {
          status: f.status as AuditStatus,
          notes: f.notes || '',
          evidence: f.evidence || '',
          // Berater-Empfehlungs-Felder
          recommendation: f.recommendation || '',
          isQuickWin: f.is_quick_win || false,
          priority: f.priority || 'should',
          estimatedEffort: f.estimated_effort || '',
          responsibleRole: f.responsible_role || ''
        };
      });
      
      setAuditState(state);
      setCreatorProfile(creator);
    } catch (error) {
      console.error('Error loading audit:', error);
      toast({
        title: 'Fehler',
        description: 'Audit konnte nicht geladen werden.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [user, auditId, fetchCreatorProfile]);

  useEffect(() => {
    loadAudit();
  }, [loadAudit]);

  // Realtime subscription for findings
  useEffect(() => {
    if (!auditId) return;

    const channel = supabase
      .channel(`audit-findings-${auditId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'audit_findings',
          filter: `audit_id=eq.${auditId}`
        },
        (payload) => {
          const data = payload.new as {
            control_id: string;
            status: string;
            notes: string | null;
            evidence: string | null;
            recommendation: string | null;
            is_quick_win: boolean | null;
            priority: string | null;
            estimated_effort: string | null;
            responsible_role: string | null;
          };
          
          if (data) {
            setAuditState(prev => ({
              ...prev,
              [data.control_id]: {
                status: data.status as AuditStatus,
                notes: data.notes || '',
                evidence: data.evidence || '',
                recommendation: data.recommendation || '',
                isQuickWin: data.is_quick_win || false,
                priority: (data.priority as 'must' | 'should' | 'nice') || 'should',
                estimatedEffort: data.estimated_effort || '',
                responsibleRole: data.responsible_role || ''
              }
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [auditId]);

  // Update client name
  const updateClientName = async (name: string) => {
    if (!audit) return;

    try {
      const { error } = await supabase
        .from('audits')
        .update({ client_name: name })
        .eq('id', audit.id);

      if (error) throw error;
      setAudit(prev => prev ? { ...prev, client_name: name } : null);
    } catch (error) {
      console.error('Error updating client name:', error);
    }
  };

  // Update finding
  const updateFinding = async (controlId: string, finding: AuditFinding, previousStatus?: AuditStatus) => {
    if (!audit) return;

    // Optimistic update
    setAuditState(prev => ({ ...prev, [controlId]: finding }));

    try {
      const { error } = await supabase
        .from('audit_findings')
        .upsert({
          audit_id: audit.id,
          control_id: controlId,
          status: finding.status,
          notes: finding.notes,
          evidence: finding.evidence,
          // Berater-Empfehlungs-Felder
          recommendation: finding.recommendation || '',
          is_quick_win: finding.isQuickWin || false,
          priority: finding.priority || 'should',
          estimated_effort: finding.estimatedEffort || '',
          responsible_role: finding.responsibleRole || ''
        }, {
          onConflict: 'audit_id,control_id'
        });

      if (error) throw error;

      // Log status change if status actually changed
      if (previousStatus && previousStatus !== finding.status) {
        await logActivity('status_change', {
          control_id: controlId,
          old_status: previousStatus,
          new_status: finding.status
        });
      }
    } catch (error) {
      console.error('Error updating finding:', error);
      toast({
        title: 'Fehler beim Speichern',
        description: 'Die Änderung konnte nicht gespeichert werden.',
        variant: 'destructive'
      });
    }
  };

  // Update audit settings (frameworks, language)
  const updateAuditSettings = async (frameworks: string[], language: SupportedLanguage) => {
    if (!audit || !user) return;

    try {
      const { error } = await supabase
        .from('audits')
        .update({ frameworks, language })
        .eq('id', audit.id);

      if (error) throw error;

      setAudit(prev => prev ? { ...prev, frameworks, language } : null);

      // Log settings change
      await logActivity('settings_changed', {
        frameworks: frameworks.join(','),
        language
      });

      toast({
        title: 'Einstellungen gespeichert',
        description: 'Die Audit-Einstellungen wurden aktualisiert.'
      });
    } catch (error) {
      console.error('Error updating audit settings:', error);
      toast({
        title: 'Fehler',
        description: 'Einstellungen konnten nicht gespeichert werden.',
        variant: 'destructive'
      });
    }
  };

  return {
    audit,
    creatorProfile,
    auditState,
    loading,
    updateClientName,
    updateFinding,
    updateAuditSettings
  };
};
