import { AuditState, AuditStatus } from '@/types/audit';
import { Framework, FrameworkSection, SupportedLanguage } from '@/types/framework';
import { getFrameworks } from '@/data/frameworks';

const statusLabels: Record<SupportedLanguage, Record<AuditStatus, string>> = {
  de: {
    [AuditStatus.UNCHECKED]: 'Nicht geprüft',
    [AuditStatus.OK]: 'Konform (OK)',
    [AuditStatus.OFI]: 'Verbesserungspotenzial (OFI)',
    [AuditStatus.MINOR_NC]: 'Geringfügige Abweichung (Minor NC)',
    [AuditStatus.MAJOR_NC]: 'Schwerwiegende Abweichung (Major NC)',
  },
  en: {
    [AuditStatus.UNCHECKED]: 'Not checked',
    [AuditStatus.OK]: 'Compliant (OK)',
    [AuditStatus.OFI]: 'Opportunity for Improvement (OFI)',
    [AuditStatus.MINOR_NC]: 'Minor Non-Conformity (Minor NC)',
    [AuditStatus.MAJOR_NC]: 'Major Non-Conformity (Major NC)',
  }
};

const reportLabels: Record<SupportedLanguage, Record<string, string>> = {
  de: {
    auditReport: 'Audit Report',
    client: 'Mandant',
    date: 'Datum',
    auditors: 'Auditoren',
    summary: 'Zusammenfassung',
    status: 'Status',
    count: 'Anzahl',
    total: 'Gesamt',
    detailedResults: 'Detaillierte Ergebnisse',
    notes: 'Notizen',
    evidence: 'Nachweise',
    recommendedAction: 'Empfohlene Korrekturmaßnahme',
    frameworks: 'Geprüfte Frameworks',
  },
  en: {
    auditReport: 'Audit Report',
    client: 'Client',
    date: 'Date',
    auditors: 'Auditors',
    summary: 'Summary',
    status: 'Status',
    count: 'Count',
    total: 'Total',
    detailedResults: 'Detailed Results',
    notes: 'Notes',
    evidence: 'Evidence',
    recommendedAction: 'Recommended Corrective Action',
    frameworks: 'Audited Frameworks',
  }
};

export interface Auditor {
  name: string;
  email?: string;
}

export const generateMultiFrameworkReport = (
  frameworkIds: string[],
  auditState: AuditState,
  clientName: string,
  language: SupportedLanguage = 'de',
  auditors: Auditor[] = []
): string => {
  const frameworks = getFrameworks(frameworkIds);
  const labels = reportLabels[language];
  const statuses = statusLabels[language];
  const dateLocale = language === 'de' ? 'de-DE' : 'en-GB';
  const date = new Date().toLocaleDateString(dateLocale);
  
  let report = `# ${labels.auditReport}\n\n`;
  report += `**${labels.client}:** ${clientName}\n`;
  report += `**${labels.date}:** ${date}\n`;
  
  // Auditors
  if (auditors.length > 0) {
    report += `**${labels.auditors}:** ${auditors.map(a => a.name).join(', ')}\n`;
  }
  report += `\n`;
  
  // List frameworks
  report += `### ${labels.frameworks}\n`;
  frameworks.forEach(fw => {
    report += `- ${fw.name} (${fw.version})\n`;
  });
  report += `\n---\n\n`;

  // Collect all controls and findings
  const allFindings: { frameworkId: string; controlId: string; control: any; finding: any }[] = [];
  
  frameworks.forEach(fw => {
    fw.groups.forEach(group => {
      group.sections.forEach(section => {
        section.controls.forEach(control => {
          const fullId = `${fw.id}:${control.id}`;
          allFindings.push({
            frameworkId: fw.id,
            controlId: fullId,
            control,
            finding: auditState[fullId]
          });
        });
      });
    });
  });

  // Summary
  const summary = {
    total: allFindings.length,
    ok: allFindings.filter(f => f.finding?.status === AuditStatus.OK).length,
    ofi: allFindings.filter(f => f.finding?.status === AuditStatus.OFI).length,
    minorNc: allFindings.filter(f => f.finding?.status === AuditStatus.MINOR_NC).length,
    majorNc: allFindings.filter(f => f.finding?.status === AuditStatus.MAJOR_NC).length,
    unchecked: allFindings.filter(f => !f.finding || f.finding.status === AuditStatus.UNCHECKED).length,
  };

  report += `## ${labels.summary}\n\n`;
  report += `| ${labels.status} | ${labels.count} |\n`;
  report += `|--------|--------|\n`;
  report += `| ${statuses[AuditStatus.OK]} | ${summary.ok} |\n`;
  report += `| ${statuses[AuditStatus.OFI]} | ${summary.ofi} |\n`;
  report += `| ${statuses[AuditStatus.MINOR_NC]} | ${summary.minorNc} |\n`;
  report += `| ${statuses[AuditStatus.MAJOR_NC]} | ${summary.majorNc} |\n`;
  report += `| ${statuses[AuditStatus.UNCHECKED]} | ${summary.unchecked} |\n`;
  report += `| **${labels.total}** | **${summary.total}** |\n\n`;

  report += `---\n\n`;
  report += `## ${labels.detailedResults}\n\n`;

  // Group by framework
  for (const framework of frameworks) {
    report += `# ${framework.shortName}\n\n`;
    
    for (const group of framework.groups) {
      report += `## ${group.title}\n\n`;
      
      for (const section of group.sections) {
        report += `### ${section.title}\n\n`;

        for (const control of section.controls) {
          const fullId = `${framework.id}:${control.id}`;
          const finding = auditState[fullId];
          const status = finding?.status || AuditStatus.UNCHECKED;
          
          report += `#### ${control.clause} - ${control.title}\n\n`;
          report += `**${labels.status}:** ${statuses[status]}\n\n`;
          
          if (finding?.notes) {
            report += `**${labels.notes}:**\n${finding.notes}\n\n`;
          }
          
          if (finding?.evidence) {
            report += `**${labels.evidence}:**\n${finding.evidence}\n\n`;
          }

          if (status === AuditStatus.MINOR_NC || status === AuditStatus.MAJOR_NC) {
            if (control.correctiveAction) {
              report += `**${labels.recommendedAction}:**\n${control.correctiveAction}\n\n`;
            }
          }

          report += `---\n\n`;
        }
      }
    }
  }

  return report;
};

// Legacy function for backwards compatibility
export const generateReportPrompt = (
  sections: FrameworkSection[],
  auditState: AuditState,
  clientName: string
): string => {
  const statusLabelsDE = statusLabels['de'];
  const date = new Date().toLocaleDateString('de-DE');
  
  let report = `# Audit Report\n`;
  report += `## ${clientName}\n`;
  report += `Datum: ${date}\n\n`;
  report += `---\n\n`;

  const allControls = sections.flatMap(s => s.controls);
  const findings = allControls.map(c => ({
    control: c,
    finding: auditState[c.id]
  }));

  const summary = {
    total: findings.length,
    ok: findings.filter(f => f.finding?.status === AuditStatus.OK).length,
    ofi: findings.filter(f => f.finding?.status === AuditStatus.OFI).length,
    minorNc: findings.filter(f => f.finding?.status === AuditStatus.MINOR_NC).length,
    majorNc: findings.filter(f => f.finding?.status === AuditStatus.MAJOR_NC).length,
    unchecked: findings.filter(f => !f.finding || f.finding.status === AuditStatus.UNCHECKED).length,
  };

  report += `## Zusammenfassung\n\n`;
  report += `| Status | Anzahl |\n`;
  report += `|--------|--------|\n`;
  report += `| Konform (OK) | ${summary.ok} |\n`;
  report += `| Verbesserungspotenzial (OFI) | ${summary.ofi} |\n`;
  report += `| Geringfügige Abweichung (Minor NC) | ${summary.minorNc} |\n`;
  report += `| Schwerwiegende Abweichung (Major NC) | ${summary.majorNc} |\n`;
  report += `| Nicht geprüft | ${summary.unchecked} |\n`;
  report += `| **Gesamt** | **${summary.total}** |\n\n`;

  report += `---\n\n`;
  report += `## Detaillierte Ergebnisse\n\n`;

  for (const section of sections) {
    report += `### ${section.title}\n\n`;

    for (const control of section.controls) {
      const finding = auditState[control.id];
      const status = finding?.status || AuditStatus.UNCHECKED;
      
      report += `#### ${control.clause} - ${control.title}\n\n`;
      report += `**Status:** ${statusLabelsDE[status]}\n\n`;
      
      if (finding?.notes) {
        report += `**Notizen:**\n${finding.notes}\n\n`;
      }
      
      if (finding?.evidence) {
        report += `**Nachweise:**\n${finding.evidence}\n\n`;
      }

      if (status === AuditStatus.MINOR_NC || status === AuditStatus.MAJOR_NC) {
        if (control.correctiveAction) {
          report += `**Empfohlene Korrekturmaßnahme:**\n${control.correctiveAction}\n\n`;
        }
      }

      report += `---\n\n`;
    }
  }

  return report;
};

export const downloadTextFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
