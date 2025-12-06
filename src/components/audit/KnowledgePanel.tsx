import React, { useState } from 'react';
import { ChevronDown, Plus, Trash2, X, Check, Loader2, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useConsultantKnowledge, knowledgeTypeLabels } from '@/hooks/useConsultantKnowledge';
import { useAuth } from '@/hooks/useAuth';
import { KnowledgeType, ConsultantKnowledge } from '@/types/audit';

interface KnowledgePanelProps {
  controlId: string;
  controlClause: string;
}

const KnowledgePanel: React.FC<KnowledgePanelProps> = ({ controlId, controlClause }) => {
  const { user } = useAuth();
  const { knowledge, loading, addKnowledge, deleteKnowledge, incrementUsage } = useConsultantKnowledge(controlId);
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<KnowledgeType>('best_practice');
  const [source, setSource] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggle = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else { next.add(id); incrementUsage(id); }
    setExpanded(next);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    setSubmitting(true);
    const ok = await addKnowledge({ control_id: controlId, knowledge_type: type, title: title.trim(), content: content.trim(), source: source.trim() });
    if (ok) { setTitle(''); setContent(''); setType('best_practice'); setSource(''); setShowForm(false); }
    setSubmitting(false);
  };

  const grouped = knowledge.reduce((acc, item) => {
    acc[item.knowledge_type] = acc[item.knowledge_type] || [];
    acc[item.knowledge_type].push(item);
    return acc;
  }, {} as Record<KnowledgeType, ConsultantKnowledge[]>);

  return (
    <div className="bg-card border border-border rounded-lg">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Beraterwissen</span>
            {knowledge.length > 0 && (
              <span className="px-1.5 py-0.5 text-xs bg-muted rounded">{knowledge.length}</span>
            )}
          </div>
          <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-3">
            {loading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {knowledge.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Keine Einträge</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(grouped).map(([t, items]) => (
                      <div key={t} className="space-y-1">
                        <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          {knowledgeTypeLabels[t as KnowledgeType].emoji}
                          {knowledgeTypeLabels[t as KnowledgeType].label}
                        </div>
                        {items.map(item => (
                          <div key={item.id} className="border border-border rounded-md">
                            <button
                              onClick={() => toggle(item.id)}
                              className="w-full flex items-center justify-between p-2.5 text-left hover:bg-muted/50 transition-colors"
                            >
                              <span className="text-sm font-medium truncate">{item.title}</span>
                              <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", expanded.has(item.id) && "rotate-180")} />
                            </button>
                            {expanded.has(item.id) && (
                              <div className="px-2.5 pb-2.5 border-t border-border pt-2">
                                <p className="text-sm whitespace-pre-wrap mb-2">{item.content}</p>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1.5">
                                    <User className="w-3 h-3" />
                                    {item.creator_name || 'Unbekannt'}
                                    {item.source && <span className="italic">• {item.source}</span>}
                                  </div>
                                  {user?.id === item.created_by && (
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => deleteKnowledge(item.id)}>
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {!showForm ? (
                  <Button variant="outline" size="sm" className="w-full" onClick={() => setShowForm(true)}>
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    Wissen teilen
                  </Button>
                ) : (
                  <div className="space-y-2 p-3 bg-muted/50 rounded-md">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Neuer Eintrag</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowForm(false)}>
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <Select value={type} onValueChange={(v) => setType(v as KnowledgeType)}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(knowledgeTypeLabels).map(([k, { label, emoji }]) => (
                          <SelectItem key={k} value={k}>{emoji} {label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input placeholder="Titel" value={title} onChange={(e) => setTitle(e.target.value)} className="h-8 text-sm" />
                    <Textarea placeholder="Inhalt..." value={content} onChange={(e) => setContent(e.target.value)} className="min-h-[60px] text-sm resize-none" />
                    <Input placeholder="Quelle (optional)" value={source} onChange={(e) => setSource(e.target.value)} className="h-8 text-sm" />
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowForm(false)} disabled={submitting}>
                        Abbrechen
                      </Button>
                      <Button size="sm" className="flex-1" onClick={handleSubmit} disabled={!title.trim() || !content.trim() || submitting}>
                        {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5 mr-1" />}
                        Speichern
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default KnowledgePanel;
