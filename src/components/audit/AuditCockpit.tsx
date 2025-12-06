import React from 'react';
import { Users, Clock, X, UserPlus, Activity } from 'lucide-react';
import { useAuditTeam, ActivityLogEntry, TeamMember } from '@/hooks/useAuditTeam';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format, formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import AuditTimer from './AuditTimer';
import ReadinessScoreDisplay from './ReadinessScore';
import { ReadinessScore, ReadinessBySection } from '@/types/audit';

interface AuditCockpitProps {
  auditId: string | undefined;
  creatorName?: string;
  createdAt?: string;
  totalControls: number;
  completedControls: number;
  readinessScore?: ReadinessScore;
  sectionScores?: ReadinessBySection[];
  recommendations?: string[];
}

const getInitials = (name: string | null | undefined): string => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const AuditCockpit: React.FC<AuditCockpitProps> = ({
  auditId, creatorName, createdAt, totalControls, completedControls,
  readinessScore, sectionScores = [], recommendations = []
}) => {
  const { teamMembers, activityLog, allUsers, loading, addTeamMember, removeTeamMember } = useAuditTeam(auditId);
  const availableUsers = allUsers.filter(u => !teamMembers.some(m => m.user_id === u.user_id));

  return (
    <aside className="w-80 bg-card border-l border-border flex-col hidden lg:flex">
      <div className="h-14 px-4 border-b border-border flex items-center">
        <span className="text-sm font-medium">Übersicht</span>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          
          {/* Readiness Score */}
          {readinessScore && (
            <ReadinessScoreDisplay score={readinessScore} sectionScores={sectionScores} recommendations={recommendations} />
          )}

          {/* Timer */}
          <AuditTimer totalControls={totalControls} completedControls={completedControls} />

          {/* Info */}
          {createdAt && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Audit-Info</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Erstellt</span>
                  <span>{format(new Date(createdAt), 'dd.MM.yyyy', { locale: de })}</span>
                </div>
                {creatorName && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ersteller</span>
                    <span>{creatorName}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Team */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Team ({teamMembers.length})
              </h4>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6" disabled={loading || availableUsers.length === 0}>
                    <UserPlus className="w-3.5 h-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {availableUsers.map(u => (
                    <DropdownMenuItem key={u.user_id} onClick={() => addTeamMember(u.user_id)}>
                      <Avatar className="h-5 w-5 mr-2">
                        <AvatarFallback className="text-[10px] bg-muted">{getInitials(u.full_name)}</AvatarFallback>
                      </Avatar>
                      {u.full_name || 'Unbekannt'}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {teamMembers.length === 0 ? (
              <p className="text-xs text-muted-foreground">Keine Mitglieder</p>
            ) : (
              <div className="space-y-1">
                {teamMembers.map(m => (
                  <div key={m.id} className="flex items-center justify-between py-1.5 group">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-[10px] bg-foreground text-background">
                          {getInitials(m.profile?.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{m.profile?.full_name || 'Unbekannt'}</span>
                    </div>
                    {teamMembers.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                        onClick={() => removeTeamMember(m.id, m.profile?.full_name || 'Unbekannt')}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Aktivitäten</h4>
            {activityLog.length === 0 ? (
              <p className="text-xs text-muted-foreground">Keine Aktivitäten</p>
            ) : (
              <div className="space-y-2">
                {activityLog.slice(0, 8).map(entry => (
                  <div key={entry.id} className="text-xs">
                    <span className="text-muted-foreground">
                      {entry.profile?.full_name || 'System'} • {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true, locale: de })}
                    </span>
                    <p className="text-foreground">
                      {entry.event_type === 'status_change' && `Status geändert: ${entry.event_data.control_id}`}
                      {entry.event_type === 'audit_created' && 'Audit erstellt'}
                      {entry.event_type === 'auditor_added' && `${entry.event_data.added_user_name} hinzugefügt`}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default AuditCockpit;
