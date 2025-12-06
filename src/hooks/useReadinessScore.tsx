import { useMemo } from 'react';
import { AuditState, AuditStatus, ReadinessScore, ReadinessBySection } from '@/types/audit';
import { getFrameworks } from '@/data/frameworks';

/**
 * Berechnet den Zertifizierungsreife-Score basierend auf den Audit-Findings
 * 
 * Score-Berechnung:
 * - OK = 100% (vollständig konform)
 * - OFI = 80% (Verbesserungspotenzial, aber zertifizierbar)
 * - Minor NC = 50% (Korrektur vor Zertifizierung empfohlen)
 * - Major NC = 0% (BLOCKER - muss vor Zertifizierung behoben werden)
 * - UNCHECKED = 0% (noch nicht geprüft)
 */
export const useReadinessScore = (
  frameworkIds: string[],
  auditState: AuditState
): {
  overallScore: ReadinessScore;
  sectionScores: ReadinessBySection[];
  recommendations: string[];
} => {
  
  const result = useMemo(() => {
    const frameworks = getFrameworks(frameworkIds);
    
    // Sammle alle Controls mit ihrem Status
    const allControlsWithStatus: { 
      frameworkId: string;
      groupId: string;
      groupTitle: string;
      sectionId: string; 
      sectionTitle: string;
      controlId: string;
      clause: string;
      status: AuditStatus;
    }[] = [];

    frameworks.forEach(fw => {
      fw.groups.forEach(group => {
        group.sections.forEach(section => {
          section.controls.forEach(control => {
            const fullId = `${fw.id}:${control.id}`;
            const finding = auditState[fullId];
            allControlsWithStatus.push({
              frameworkId: fw.id,
              groupId: group.id,
              groupTitle: group.title,
              sectionId: section.id,
              sectionTitle: section.title,
              controlId: fullId,
              clause: control.clause,
              status: finding?.status || AuditStatus.UNCHECKED
            });
          });
        });
      });
    });

    // Zähle Status-Verteilung
    const okCount = allControlsWithStatus.filter(c => c.status === AuditStatus.OK).length;
    const ofiCount = allControlsWithStatus.filter(c => c.status === AuditStatus.OFI).length;
    const minorNcCount = allControlsWithStatus.filter(c => c.status === AuditStatus.MINOR_NC).length;
    const majorNcCount = allControlsWithStatus.filter(c => c.status === AuditStatus.MAJOR_NC).length;
    const uncheckedCount = allControlsWithStatus.filter(c => c.status === AuditStatus.UNCHECKED).length;
    const totalControls = allControlsWithStatus.length;
    const assessedControls = totalControls - uncheckedCount;

    // Berechne Gesamt-Score
    let readinessScore = 0;
    if (totalControls > 0) {
      const weightedSum = 
        (okCount * 100) + 
        (ofiCount * 80) + 
        (minorNcCount * 50) + 
        (majorNcCount * 0) + 
        (uncheckedCount * 0);
      readinessScore = Math.round(weightedSum / totalControls);
    }

    const overallScore: ReadinessScore = {
      totalControls,
      assessedControls,
      okCount,
      ofiCount,
      minorNcCount,
      majorNcCount,
      uncheckedCount,
      readinessScore,
      hasBlockers: majorNcCount > 0
    };

    // Berechne Scores pro Sektion
    const sectionMap = new Map<string, ReadinessBySection>();
    
    allControlsWithStatus.forEach(c => {
      const key = `${c.frameworkId}:${c.sectionId}`;
      if (!sectionMap.has(key)) {
        sectionMap.set(key, {
          sectionId: key,
          sectionTitle: c.sectionTitle,
          score: 0,
          status: 'ready',
          controls: []
        });
      }
      
      const section = sectionMap.get(key)!;
      section.controls.push({
        id: c.controlId,
        clause: c.clause,
        status: c.status
      });
    });

    // Berechne Score pro Sektion
    const sectionScores: ReadinessBySection[] = [];
    sectionMap.forEach((section) => {
      const sectionOk = section.controls.filter(c => c.status === AuditStatus.OK).length;
      const sectionOfi = section.controls.filter(c => c.status === AuditStatus.OFI).length;
      const sectionMinor = section.controls.filter(c => c.status === AuditStatus.MINOR_NC).length;
      const sectionMajor = section.controls.filter(c => c.status === AuditStatus.MAJOR_NC).length;
      const sectionTotal = section.controls.length;

      if (sectionTotal > 0) {
        const weightedSum = (sectionOk * 100) + (sectionOfi * 80) + (sectionMinor * 50);
        section.score = Math.round(weightedSum / sectionTotal);
      }

      // Bestimme Status
      if (sectionMajor > 0) {
        section.status = 'critical';
      } else if (sectionMinor > 0 || section.score < 70) {
        section.status = 'warning';
      } else {
        section.status = 'ready';
      }

      sectionScores.push(section);
    });

    // Generiere Empfehlungen
    const recommendations: string[] = [];
    
    if (majorNcCount > 0) {
      recommendations.push(`🔴 ${majorNcCount} Major NC(s) müssen vor der Zertifizierung behoben werden`);
    }
    
    if (minorNcCount > 0) {
      recommendations.push(`🟡 ${minorNcCount} Minor NC(s) sollten vor der Zertifizierung adressiert werden`);
    }
    
    if (uncheckedCount > 0) {
      const percentage = Math.round((uncheckedCount / totalControls) * 100);
      recommendations.push(`⚪ ${uncheckedCount} Controls (${percentage}%) noch nicht geprüft`);
    }
    
    if (readinessScore >= 85 && majorNcCount === 0) {
      recommendations.push('✅ Gute Zertifizierungsreife - Audit kann empfohlen werden');
    } else if (readinessScore >= 70 && majorNcCount === 0) {
      recommendations.push('⚠️ Zertifizierung möglich, aber Nachbesserungen empfohlen');
    } else if (majorNcCount > 0) {
      recommendations.push('🚫 Zertifizierung nicht empfohlen bis Major NCs behoben sind');
    }

    return { overallScore, sectionScores, recommendations };
  }, [frameworkIds, auditState]);

  return result;
};

