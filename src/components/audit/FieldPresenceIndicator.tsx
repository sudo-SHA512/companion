import React from 'react';
import { UserPresence } from '@/hooks/useAuditPresence';
import { cn } from '@/lib/utils';

interface FieldPresenceIndicatorProps {
  viewers: UserPresence[];
  className?: string;
}

export const FieldPresenceIndicator: React.FC<FieldPresenceIndicatorProps> = ({ viewers, className }) => {
  if (viewers.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {viewers.slice(0, 3).map((viewer) => (
        <div
          key={viewer.id}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium animate-pulse"
          style={{ 
            backgroundColor: `${viewer.color}20`,
            color: viewer.color,
            borderColor: viewer.color,
            borderWidth: 1
          }}
          title={`${viewer.full_name || viewer.email} bearbeitet gerade`}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: viewer.color }} />
          <span className="max-w-[80px] truncate">
            {viewer.full_name?.split(' ')[0] || viewer.email.split('@')[0]}
          </span>
        </div>
      ))}
      {viewers.length > 3 && (
        <span className="text-xs text-muted-foreground">+{viewers.length - 3}</span>
      )}
    </div>
  );
};
