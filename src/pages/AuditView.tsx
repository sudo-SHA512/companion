import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Download, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAuditDetail } from '@/hooks/useAuditDetail';
import { useAuditTeam } from '@/hooks/useAuditTeam';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuditPresence, FieldType } from '@/hooks/useAuditPresence';
import { useReadinessScore } from '@/hooks/useReadinessScore';
import Sidebar from '@/components/audit/Sidebar';
import AuditCard from '@/components/audit/AuditCard';
import AuditCockpit from '@/components/audit/AuditCockpit';
import KnowledgePanel from '@/components/audit/KnowledgePanel';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AuditFinding, AuditStatus } from '@/types/audit';
import { SupportedLanguage, FrameworkControl } from '@/types/framework';
import { getFrameworks, countTotalControls } from '@/data/frameworks';
import { generateMultiFrameworkReport, downloadTextFile, Auditor } from '@/utils/export';
import { Button } from '@/components/ui/button';

const AuditView: React.FC = () => {
  const { auditId } = useParams<{ auditId: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { audit, creatorProfile, auditState, loading: auditLoading, updateClientName, updateFinding, updateAuditSettings } = useAuditDetail(auditId);
  const { teamMembers } = useAuditTeam(auditId);
  const { setLanguage } = useLanguage();
  const { updateMyPresence, getUsersEditingField } = useAuditPresence(auditId || '');
  const [activeField, setActiveField] = useState<FieldType>(null);

  const currentFrameworks = useMemo(() => audit?.frameworks || ['iso27001'], [audit]);

  const getFirstControlId = (): string => {
    const frameworks = getFrameworks(currentFrameworks);
    if (frameworks.length > 0 && frameworks[0].groups.length > 0) {
      const firstGroup = frameworks[0].groups[0];
      if (firstGroup.sections.length > 0 && firstGroup.sections[0].controls.length > 0) {
        return `${frameworks[0].id}:${firstGroup.sections[0].controls[0].id}`;
      }
    }
    return 'iso27001:4.1';
  };

  const [activeControlId, setActiveControlId] = useState<string>('iso27001:4.1');
  const [clientNameInput, setClientNameInput] = useState('');

  const handleFieldFocus = useCallback((field: FieldType) => {
    setActiveField(field);
    updateMyPresence(activeControlId, field);
  }, [activeControlId, updateMyPresence]);

  const getFieldViewers = useCallback((field: FieldType) => {
    return getUsersEditingField(activeControlId, field);
  }, [activeControlId, getUsersEditingField]);

  useEffect(() => { if (!authLoading && !user) navigate('/auth'); }, [user, authLoading, navigate]);
  useEffect(() => { if (audit?.language) setLanguage(audit.language as SupportedLanguage); }, [audit?.language, setLanguage]);
  useEffect(() => { if (audit) { setClientNameInput(audit.client_name); setActiveControlId(getFirstControlId()); } }, [audit]);
  useEffect(() => { if (activeControlId) updateMyPresence(activeControlId, activeField); }, [activeControlId, activeField, updateMyPresence]);

  const activeControl = useMemo((): FrameworkControl | null => {
    const [frameworkId, controlId] = activeControlId.split(':');
    for (const framework of getFrameworks(currentFrameworks)) {
      if (framework.id !== frameworkId) continue;
      for (const group of framework.groups) {
        for (const section of group.sections) {
          const found = section.controls.find(c => c.id === controlId);
          if (found) return found;
        }
      }
    }
    return null;
  }, [activeControlId, currentFrameworks]);

  const totalControls = useMemo(() => countTotalControls(currentFrameworks), [currentFrameworks]);
  const completedControls = useMemo(() => (Object.values(auditState) as AuditFinding[]).filter(f => f.status !== AuditStatus.UNCHECKED).length, [auditState]);
  const progress = totalControls > 0 ? Math.round((completedControls / totalControls) * 100) : 0;
  const { overallScore, sectionScores, recommendations } = useReadinessScore(currentFrameworks, auditState);

  const handleExport = () => {
    const clientName = audit?.client_name || 'Audit';
    const language = (audit?.language || 'de') as SupportedLanguage;
    const auditors: Auditor[] = [];
    if (creatorProfile?.full_name) auditors.push({ name: creatorProfile.full_name });
    teamMembers.forEach(m => { if (m.profile?.full_name && m.user_id !== audit?.user_id) auditors.push({ name: m.profile.full_name }); });
    const text = generateMultiFrameworkReport(currentFrameworks, auditState, clientName, language, auditors);
    downloadTextFile(text, `Audit_${clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`);
  };

  if (authLoading || auditLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  if (!audit) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <p className="text-muted-foreground">Audit nicht gefunden</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Zurück
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        frameworkIds={currentFrameworks}
        activeControlId={activeControlId} 
        onSelectControl={setActiveControlId}
        auditState={auditState}
        currentLanguage={(audit?.language || 'de') as SupportedLanguage}
        onSettingsSave={updateAuditSettings}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-4 border-b border-border bg-background">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <input 
              type="text" 
              value={clientNameInput}
              onChange={(e) => setClientNameInput(e.target.value)}
              onBlur={() => { if (clientNameInput !== audit?.client_name) updateClientName(clientNameInput); }}
              className="bg-transparent text-sm font-medium focus:outline-none w-48"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <span className="font-medium tabular-nums">{progress}%</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-1.5" />
              Export
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {activeControl && (
                <>
                  <AuditCard 
                    key={activeControlId} 
                    control={activeControl}
                    finding={auditState[activeControlId] || { status: AuditStatus.UNCHECKED, notes: '', evidence: '' }}
                    auditId={audit?.id || ''}
                    onUpdateFinding={(finding) => {
                      const prev = auditState[activeControlId]?.status;
                      updateFinding(activeControlId, finding, prev);
                    }}
                    onFieldFocus={handleFieldFocus}
                    getFieldViewers={getFieldViewers}
                  />
                  <KnowledgePanel controlId={activeControlId} controlClause={activeControl.clause} />
                </>
              )}
            </div>
          </main>

          <AuditCockpit
            auditId={audit?.id}
            creatorName={creatorProfile?.full_name}
            createdAt={audit?.created_at}
            totalControls={totalControls}
            completedControls={completedControls}
            readinessScore={overallScore}
            sectionScores={sectionScores}
            recommendations={recommendations}
          />
        </div>
      </div>
    </div>
  );
};

export default AuditView;
