import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { getAvailableFrameworks } from '@/data/frameworks';
import { SupportedLanguage } from '@/types/framework';
import { useLanguage } from '@/hooks/useLanguage';

interface AuditSettingsDialogProps {
  currentFrameworks: string[];
  currentLanguage: SupportedLanguage;
  onSave: (frameworks: string[], language: SupportedLanguage) => void;
}

const AuditSettingsDialog: React.FC<AuditSettingsDialogProps> = ({
  currentFrameworks,
  currentLanguage,
  onSave,
}) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(currentFrameworks);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(currentLanguage);
  
  const availableFrameworks = getAvailableFrameworks();

  useEffect(() => {
    if (open) {
      setSelectedFrameworks(currentFrameworks);
      setSelectedLanguage(currentLanguage);
    }
  }, [open, currentFrameworks, currentLanguage]);

  const handleFrameworkToggle = (frameworkId: string, checked: boolean) => {
    if (checked) {
      setSelectedFrameworks(prev => [...prev, frameworkId]);
    } else {
      setSelectedFrameworks(prev => prev.filter(id => id !== frameworkId));
    }
  };

  const handleSave = () => {
    if (selectedFrameworks.length === 0) return;
    onSave(selectedFrameworks, selectedLanguage);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full flex items-center gap-2 justify-start text-muted-foreground hover:text-foreground"
        >
          <Settings className="w-4 h-4" />
          <span className="text-xs">{t('settings')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('auditSettings')}</DialogTitle>
          <DialogDescription>
            {t('auditSettingsDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Language Selection */}
          <div className="space-y-2">
            <Label>{t('reportLanguage')}</Label>
            <Select
              value={selectedLanguage}
              onValueChange={(value) => setSelectedLanguage(value as SupportedLanguage)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Framework Selection */}
          <div className="space-y-3">
            <Label>{t('selectFrameworks')}</Label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableFrameworks.map((framework) => (
                <div
                  key={framework.id}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={`settings-fw-${framework.id}`}
                    checked={selectedFrameworks.includes(framework.id)}
                    onCheckedChange={(checked) =>
                      handleFrameworkToggle(framework.id, checked as boolean)
                    }
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={`settings-fw-${framework.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {framework.shortName}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {framework.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {selectedFrameworks.length === 0 && (
              <p className="text-xs text-destructive">
                {t('selectAtLeastOneFramework')}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSave} disabled={selectedFrameworks.length === 0}>
            {t('saveChanges')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuditSettingsDialog;
