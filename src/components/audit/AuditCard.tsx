import React, { useEffect, useState, useCallback } from 'react';
import { Check, AlertCircle, AlertTriangle, XCircle, Circle, Paperclip } from 'lucide-react';
import { AuditFinding, AuditStatus } from '@/types/audit';
import { FrameworkControl } from '@/types/framework';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EvidenceUpload } from './EvidenceUpload';
import { supabase } from '@/integrations/supabase/client';
import { FieldPresenceIndicator } from './FieldPresenceIndicator';
import { UserPresence, FieldType } from '@/hooks/useAuditPresence';
import { useRealtimeEvidenceFiles } from '@/hooks/useRealtimeFindings';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

interface EvidenceFile {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
}

interface AuditCardProps {
  control: FrameworkControl;
  finding: AuditFinding;
  auditId: string;
  onUpdateFinding: (finding: AuditFinding) => void;
  onFieldFocus?: (field: FieldType) => void;
  getFieldViewers?: (field: FieldType) => UserPresence[];
}

const statusOptions = [
  { value: AuditStatus.UNCHECKED, label: 'Offen', icon: Circle, color: 'text-muted-foreground', bg: 'bg-muted', activeBg: 'bg-muted-foreground' },
  { value: AuditStatus.OK, label: 'Konform', icon: Check, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', activeBg: 'bg-emerald-600' },
  { value: AuditStatus.OFI, label: 'OFI', icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', activeBg: 'bg-blue-600' },
  { value: AuditStatus.MINOR_NC, label: 'Minor', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', activeBg: 'bg-amber-600' },
  { value: AuditStatus.MAJOR_NC, label: 'Major', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', activeBg: 'bg-red-600' },
];

const AuditCard: React.FC<AuditCardProps> = ({ control, finding, auditId, onUpdateFinding, onFieldFocus, getFieldViewers }) => {
  const [evidenceFiles, setEvidenceFiles] = useState<EvidenceFile[]>([]);
  const [localNotes, setLocalNotes] = useState(finding.notes);
  const [localEvidence, setLocalEvidence] = useState(finding.evidence);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isEditingEvidence, setIsEditingEvidence] = useState(false);
  
  const debouncedNotes = useDebounce(localNotes, 500);
  const debouncedEvidence = useDebounce(localEvidence, 500);
  
  useEffect(() => { if (!isEditingNotes) setLocalNotes(finding.notes); }, [finding.notes, isEditingNotes]);
  useEffect(() => { if (!isEditingEvidence) setLocalEvidence(finding.evidence); }, [finding.evidence, isEditingEvidence]);
  useEffect(() => { if (isEditingNotes && debouncedNotes !== finding.notes) onUpdateFinding({ ...finding, notes: debouncedNotes }); }, [debouncedNotes, isEditingNotes]);
  useEffect(() => { if (isEditingEvidence && debouncedEvidence !== finding.evidence) onUpdateFinding({ ...finding, evidence: debouncedEvidence }); }, [debouncedEvidence, isEditingEvidence]);

  const loadEvidenceFiles = useCallback(async () => {
    const { data } = await supabase.from('evidence_files').select('*').eq('audit_id', auditId).eq('control_id', control.id).order('created_at', { ascending: false });
    if (data) setEvidenceFiles(data);
  }, [auditId, control.id]);

  useRealtimeEvidenceFiles(auditId, control.id, loadEvidenceFiles);
  useEffect(() => { if (auditId && control.id) loadEvidenceFiles(); }, [auditId, control.id, loadEvidenceFiles]);

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-foreground text-background flex items-center justify-center font-semibold text-lg flex-shrink-0">
            {control.clause}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold mb-1">{control.title}</h2>
            <p className="text-sm text-muted-foreground">{control.description}</p>
          </div>
        </div>
      </div>

      {/* Info Tabs */}
      <Tabs defaultValue="questions" className="border-b border-border">
        <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b border-border rounded-none">
          <TabsTrigger value="questions" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-4 py-2.5 text-sm">
            Fragen
          </TabsTrigger>
          <TabsTrigger value="norm" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-4 py-2.5 text-sm">
            Normtext
          </TabsTrigger>
          <TabsTrigger value="purpose" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-4 py-2.5 text-sm">
            Zweck
          </TabsTrigger>
          {control.correctiveAction && (
            <TabsTrigger value="action" className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-4 py-2.5 text-sm">
              Maßnahme
            </TabsTrigger>
          )}
        </TabsList>

        <div className="p-4">
          <TabsContent value="questions" className="mt-0">
            <ul className="space-y-2">
              {control.questions.map((q, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
          <TabsContent value="norm" className="mt-0">
            <p className="text-sm text-muted-foreground italic">"{control.isoText}"</p>
          </TabsContent>
          <TabsContent value="purpose" className="mt-0">
            <p className="text-sm">{control.purpose}</p>
          </TabsContent>
          {control.correctiveAction && (
            <TabsContent value="action" className="mt-0">
              <p className="text-sm">{control.correctiveAction}</p>
            </TabsContent>
          )}
        </div>
      </Tabs>

      {/* Status Selection */}
      <div className="p-6 border-b border-border">
        <h3 className="text-sm font-medium mb-3">Bewertung</h3>
        <div className="flex gap-2">
          {statusOptions.map(({ value, label, icon: Icon, color, bg, activeBg }) => {
            const isActive = finding.status === value;
            return (
              <button
                key={value}
                onClick={() => onUpdateFinding({ ...finding, status: value })}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive ? `${activeBg} text-white` : `${bg} ${color} hover:opacity-80`
                )}
              >
                <Icon className="w-4 h-4" strokeWidth={isActive ? 2.5 : 2} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Documentation */}
      <div className="p-6 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Notizen</label>
            <FieldPresenceIndicator viewers={getFieldViewers?.('notes') || []} />
          </div>
          <Textarea
            placeholder="Beobachtungen und Anmerkungen..."
            value={localNotes}
            onChange={(e) => setLocalNotes(e.target.value)}
            onFocus={() => { setIsEditingNotes(true); onFieldFocus?.('notes'); }}
            onBlur={() => {
              if (localNotes !== finding.notes) onUpdateFinding({ ...finding, notes: localNotes });
              setIsEditingNotes(false);
              onFieldFocus?.(null);
            }}
            className="min-h-[100px] resize-none text-sm"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Nachweise</label>
            <FieldPresenceIndicator viewers={getFieldViewers?.('evidence') || []} />
          </div>
          <Textarea
            placeholder="Dokumentierte Nachweise und Referenzen..."
            value={localEvidence}
            onChange={(e) => setLocalEvidence(e.target.value)}
            onFocus={() => { setIsEditingEvidence(true); onFieldFocus?.('evidence'); }}
            onBlur={() => {
              if (localEvidence !== finding.evidence) onUpdateFinding({ ...finding, evidence: localEvidence });
              setIsEditingEvidence(false);
              onFieldFocus?.(null);
            }}
            className="min-h-[80px] resize-none text-sm"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <Paperclip className="w-4 h-4" />
              Anhänge
            </label>
            <FieldPresenceIndicator viewers={getFieldViewers?.('files') || []} />
          </div>
          <div className="p-3 bg-muted/50 rounded-md border border-dashed border-border">
            <EvidenceUpload auditId={auditId} controlId={control.id} files={evidenceFiles} onFilesChange={loadEvidenceFiles} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditCard;
