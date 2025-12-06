import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuditTimerProps {
  totalControls: number;
  completedControls: number;
}

const AuditTimer: React.FC<AuditTimerProps> = ({ totalControls, completedControls }) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isRunning]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = totalControls > 0 ? (completedControls / totalControls) * 100 : 0;
  const avgTime = completedControls > 0 ? Math.round(seconds / completedControls) : 0;
  const remaining = avgTime * (totalControls - completedControls);

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Timer</h4>
      
      <div className="text-center">
        <div className="text-2xl font-mono font-medium tabular-nums mb-2">{formatTime(seconds)}</div>
        <div className="flex justify-center gap-1">
          <Button
            variant={isRunning ? "secondary" : "default"}
            size="sm"
            onClick={() => setIsRunning(!isRunning)}
            className="h-7 px-2.5 text-xs"
          >
            {isRunning ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
            {isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setSeconds(0); setIsRunning(false); }}
            className="h-7 px-2.5 text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Fortschritt</span>
          <span>{completedControls}/{totalControls}</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {completedControls > 0 && (
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="p-2 bg-muted rounded-md">
            <div className="font-medium">{avgTime}s</div>
            <div className="text-muted-foreground">Ø pro Control</div>
          </div>
          <div className="p-2 bg-muted rounded-md">
            <div className="font-medium">{formatTime(remaining)}</div>
            <div className="text-muted-foreground">Verbleibend</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditTimer;
