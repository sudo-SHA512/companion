import React, { useState, useMemo } from 'react';
import { ChevronRight, CheckCircle, AlertCircle, AlertTriangle, XCircle, Circle, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuditState, AuditStatus } from '@/types/audit';
import { Framework, SupportedLanguage } from '@/types/framework';
import { getFrameworks } from '@/data/frameworks';
import AuditSettingsDialog from './AuditSettingsDialog';

interface SidebarProps {
  frameworkIds: string[];
  activeControlId: string;
  onSelectControl: (id: string) => void;
  auditState: AuditState;
  currentLanguage: SupportedLanguage;
  onSettingsSave: (frameworks: string[], language: SupportedLanguage) => void;
}

const StatusIcon: React.FC<{ status: AuditStatus; size?: number }> = ({ status, size = 14 }) => {
  const props = { width: size, height: size, strokeWidth: 2 };
  switch (status) {
    case AuditStatus.OK:
      return <CheckCircle {...props} className="text-emerald-500" />;
    case AuditStatus.OFI:
      return <AlertCircle {...props} className="text-blue-500" />;
    case AuditStatus.MINOR_NC:
      return <AlertTriangle {...props} className="text-amber-500" />;
    case AuditStatus.MAJOR_NC:
      return <XCircle {...props} className="text-red-500" />;
    default:
      return <Circle {...props} className="text-muted-foreground/40" />;
  }
};

const Sidebar: React.FC<SidebarProps> = ({ 
  frameworkIds, activeControlId, onSelectControl, auditState, currentLanguage, onSettingsSave 
}) => {
  const frameworks = useMemo(() => getFrameworks(frameworkIds), [frameworkIds]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggle = (set: Set<string>, setFn: React.Dispatch<React.SetStateAction<Set<string>>>, key: string) => {
    const next = new Set(set);
    next.has(key) ? next.delete(key) : next.add(key);
    setFn(next);
  };

  return (
    <aside className="w-72 bg-sidebar border-r border-sidebar-border flex flex-col h-screen">
      {/* Header */}
      <div className="h-14 px-4 border-b border-sidebar-border flex items-center">
        <span className="text-sm font-medium">Controls</span>
        <span className="ml-auto text-xs text-muted-foreground">
          {Object.values(auditState).filter(f => f.status !== AuditStatus.UNCHECKED).length} geprüft
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        {frameworks.map(framework => (
          <div key={framework.id} className="mb-1">
            {frameworks.length > 1 && (
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {framework.shortName}
              </div>
            )}
            
            {framework.groups.map(group => {
              const groupKey = `${framework.id}:${group.id}`;
              const isExpanded = expandedGroups.has(groupKey);
              
              return (
                <div key={groupKey}>
                  <button
                    onClick={() => toggle(expandedGroups, setExpandedGroups, groupKey)}
                    className="w-full flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-sidebar-foreground hover:text-foreground rounded-md hover:bg-sidebar-accent transition-colors"
                  >
                    <ChevronRight className={cn("w-3.5 h-3.5 transition-transform", isExpanded && "rotate-90")} />
                    <span className="truncate">{group.title}</span>
                  </button>

                  {isExpanded && (
                    <div className="ml-3 border-l border-sidebar-border">
                      {group.sections.map(section => {
                        const sectionKey = `${framework.id}:${section.id}`;
                        const isSectionExpanded = expandedSections.has(sectionKey);
                        
                        return (
                          <div key={sectionKey}>
                            <button
                              onClick={() => toggle(expandedSections, setExpandedSections, sectionKey)}
                              className="w-full flex items-center gap-1.5 px-2 py-1.5 text-xs text-sidebar-foreground hover:text-foreground rounded-md hover:bg-sidebar-accent transition-colors"
                            >
                              <ChevronRight className={cn("w-3 h-3 transition-transform", isSectionExpanded && "rotate-90")} />
                              <span className="truncate">{section.title}</span>
                            </button>

                            {isSectionExpanded && (
                              <div className="ml-2">
                                {section.controls.map(control => {
                                  const controlId = `${framework.id}:${control.id}`;
                                  const status = auditState[controlId]?.status || AuditStatus.UNCHECKED;
                                  const isActive = activeControlId === controlId;
                                  
                                  return (
                                    <button
                                      key={controlId}
                                      onClick={() => onSelectControl(controlId)}
                                      className={cn(
                                        "w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded-md transition-colors",
                                        isActive 
                                          ? "bg-foreground text-background font-medium" 
                                          : "text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent"
                                      )}
                                    >
                                      <StatusIcon status={status} size={12} />
                                      <span className="truncate">{control.clause}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Settings */}
      <div className="p-2 border-t border-sidebar-border">
        <AuditSettingsDialog
          currentFrameworks={frameworkIds}
          currentLanguage={currentLanguage}
          onSave={onSettingsSave}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
