import React, { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAvailableFrameworks } from '@/data/frameworks';
import { SupportedLanguage, FrameworkMeta } from '@/types/framework';
import { cn } from '@/lib/utils';

interface CreateAuditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateAudit: (clientName: string, language: SupportedLanguage, frameworks: string[]) => void;
}

const languages = [
  { value: 'de' as SupportedLanguage, label: 'Deutsch' },
  { value: 'en' as SupportedLanguage, label: 'English' },
];

export const CreateAuditDialog: React.FC<CreateAuditDialogProps> = ({ open, onOpenChange, onCreateAudit }) => {
  const [clientName, setClientName] = useState('');
  const [language, setLanguage] = useState<SupportedLanguage>('de');
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(['iso27001']);
  
  const availableFrameworks = getAvailableFrameworks();

  const toggleFramework = (id: string) => {
    setSelectedFrameworks(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter(f => f !== id);
      }
      return [...prev, id];
    });
  };

  const handleCreate = () => {
    const name = clientName.trim();
    if (name && selectedFrameworks.length > 0) {
      onCreateAudit(name, language, selectedFrameworks);
      onOpenChange(false);
      setClientName('');
      setLanguage('de');
      setSelectedFrameworks(['iso27001']);
    }
  };

  const isValid = clientName.trim().length > 0 && selectedFrameworks.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Neues Audit</DialogTitle>
          <DialogDescription>Erstellen Sie ein neues Compliance-Audit.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Kundenname</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value.slice(0, 100))}
              placeholder="Name eingeben..."
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Sprache</Label>
            <Select value={language} onValueChange={(v) => setLanguage(v as SupportedLanguage)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map(l => (
                  <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Frameworks</Label>
            <div className="space-y-1">
              {availableFrameworks.map((fw: FrameworkMeta) => {
                const selected = selectedFrameworks.includes(fw.id);
                return (
                  <button
                    key={fw.id}
                    onClick={() => toggleFramework(fw.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-md border text-left transition-colors",
                      selected ? "border-foreground bg-muted" : "border-border hover:bg-muted/50"
                    )}
                  >
                    <div>
                      <div className="text-sm font-medium">{fw.shortName}</div>
                      <div className="text-xs text-muted-foreground">{fw.description}</div>
                    </div>
                    {selected && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
          <Button onClick={handleCreate} disabled={!isValid}>Erstellen</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
