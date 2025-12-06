import React, { useState } from 'react';
import { ChevronDown, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ReadinessScore as ReadinessScoreType, ReadinessBySection } from '@/types/audit';

interface ReadinessScoreProps {
  score: ReadinessScoreType;
  sectionScores: ReadinessBySection[];
  recommendations: string[];
}

const getStatusIcon = (status: 'ready' | 'warning' | 'critical') => {
  switch (status) {
    case 'ready': return <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />;
    case 'warning': return <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />;
    case 'critical': return <XCircle className="w-3.5 h-3.5 text-red-500" />;
  }
};

const ReadinessScoreDisplay: React.FC<ReadinessScoreProps> = ({ score, sectionScores, recommendations }) => {
  const [open, setOpen] = useState(false);

  const sorted = [...sectionScores].sort((a, b) => {
    const p = { critical: 0, warning: 1, ready: 2 };
    return p[a.status] - p[b.status];
  });

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Zertifizierungsreife</h4>
      
      {/* Main Score */}
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-14 h-14 rounded-lg flex items-center justify-center text-lg font-semibold",
          score.hasBlockers 
            ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
            : score.readinessScore >= 85
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
              : score.readinessScore >= 70
                ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
        )}>
          {score.readinessScore}%
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">
            {score.hasBlockers ? 'Blocker vorhanden' 
              : score.readinessScore >= 85 ? 'Bereit' 
              : score.readinessScore >= 70 ? 'Nachbessern' 
              : 'Nicht bereit'}
          </div>
          <div className="text-xs text-muted-foreground">
            {score.assessedControls}/{score.totalControls} geprüft
          </div>
        </div>
      </div>

      {/* Status Counts */}
      <div className="grid grid-cols-5 gap-1 text-center text-xs">
        <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded">
          <div className="font-medium text-emerald-700 dark:text-emerald-400">{score.okCount}</div>
          <div className="text-emerald-600/70 dark:text-emerald-500/70">OK</div>
        </div>
        <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded">
          <div className="font-medium text-blue-700 dark:text-blue-400">{score.ofiCount}</div>
          <div className="text-blue-600/70 dark:text-blue-500/70">OFI</div>
        </div>
        <div className="p-1.5 bg-amber-50 dark:bg-amber-900/20 rounded">
          <div className="font-medium text-amber-700 dark:text-amber-400">{score.minorNcCount}</div>
          <div className="text-amber-600/70 dark:text-amber-500/70">Minor</div>
        </div>
        <div className="p-1.5 bg-red-50 dark:bg-red-900/20 rounded">
          <div className="font-medium text-red-700 dark:text-red-400">{score.majorNcCount}</div>
          <div className="text-red-600/70 dark:text-red-500/70">Major</div>
        </div>
        <div className="p-1.5 bg-muted rounded">
          <div className="font-medium">{score.uncheckedCount}</div>
          <div className="text-muted-foreground">Offen</div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="text-xs space-y-1">
          {recommendations.map((r, i) => (
            <p key={i} className="text-muted-foreground">• {r}</p>
          ))}
        </div>
      )}

      {/* Section Details */}
      {sectionScores.length > 0 && (
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full text-xs text-muted-foreground hover:text-foreground">
            <span>Details ({sectionScores.length})</span>
            <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-1.5">
            {sorted.map(s => (
              <div key={s.sectionId} className="flex items-center gap-2 text-xs">
                {getStatusIcon(s.status)}
                <span className="flex-1 truncate">{s.sectionTitle}</span>
                <span className="font-medium tabular-nums">{s.score}%</span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
};

export default ReadinessScoreDisplay;
