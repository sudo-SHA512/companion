import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Building2,
  Server,
  Calendar,
  Target,
  Users,
  Plus,
  Trash2,
  Save,
  X,
  FileText,
  Loader2,
  ClipboardList
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuditPlanning } from '@/hooks/useAuditPlanning';
import { AuditLocation, AuditContact } from '@/types/audit';

interface AuditPlanningDialogProps {
  auditId: string;
  clientName: string;
}

const AuditPlanningDialog: React.FC<AuditPlanningDialogProps> = ({ auditId, clientName }) => {
  const { planning, contacts, loading, savePlanning, addContact, deleteContact } = useAuditPlanning(auditId);
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Local form state
  const [scopeDescription, setScopeDescription] = useState('');
  const [locations, setLocations] = useState<AuditLocation[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [systems, setSystems] = useState<string[]>([]);
  const [exclusions, setExclusions] = useState('');
  const [plannedStartDate, setPlannedStartDate] = useState('');
  const [plannedEndDate, setPlannedEndDate] = useState('');
  const [certificationTargetDate, setCertificationTargetDate] = useState('');
  const [preparationNotes, setPreparationNotes] = useState('');

  // New items input
  const [newLocation, setNewLocation] = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const [newSystem, setNewSystem] = useState('');

  // Contact form
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [contactDepartment, setContactDepartment] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Load existing data
  useEffect(() => {
    if (planning) {
      setScopeDescription(planning.scope_description || '');
      setLocations(planning.locations || []);
      setDepartments(planning.departments || []);
      setSystems(planning.systems || []);
      setExclusions(planning.exclusions || '');
      setPlannedStartDate(planning.planned_start_date || '');
      setPlannedEndDate(planning.planned_end_date || '');
      setCertificationTargetDate(planning.certification_target_date || '');
      setPreparationNotes(planning.preparation_notes || '');
    }
  }, [planning]);

  const handleSave = async () => {
    setIsSaving(true);
    await savePlanning({
      scope_description: scopeDescription,
      locations,
      departments,
      systems,
      exclusions,
      planned_start_date: plannedStartDate || undefined,
      planned_end_date: plannedEndDate || undefined,
      certification_target_date: certificationTargetDate || undefined,
      preparation_notes: preparationNotes
    });
    setIsSaving(false);
  };

  const handleAddLocation = () => {
    if (newLocation.trim()) {
      setLocations([...locations, { name: newLocation.trim() }]);
      setNewLocation('');
    }
  };

  const handleAddDepartment = () => {
    if (newDepartment.trim() && !departments.includes(newDepartment.trim())) {
      setDepartments([...departments, newDepartment.trim()]);
      setNewDepartment('');
    }
  };

  const handleAddSystem = () => {
    if (newSystem.trim() && !systems.includes(newSystem.trim())) {
      setSystems([...systems, newSystem.trim()]);
      setNewSystem('');
    }
  };

  const handleAddContact = async () => {
    if (!contactName.trim()) return;

    await addContact({
      name: contactName.trim(),
      role: contactRole.trim(),
      department: contactDepartment.trim(),
      email: contactEmail.trim(),
      phone: contactPhone.trim(),
      responsible_areas: [],
      notes: ''
    });

    setContactName('');
    setContactRole('');
    setContactDepartment('');
    setContactEmail('');
    setContactPhone('');
    setShowContactForm(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <ClipboardList className="w-4 h-4" />
          Audit-Planung
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary" />
            Audit-Planung: {clientName}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Tabs defaultValue="scope" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="scope">Scope</TabsTrigger>
              <TabsTrigger value="schedule">Zeitplan</TabsTrigger>
              <TabsTrigger value="contacts">Ansprechpartner</TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1 mt-4">
              {/* SCOPE TAB */}
              <TabsContent value="scope" className="space-y-6 pr-4">
                {/* Scope Description */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    Anwendungsbereich (Scope)
                  </label>
                  <Textarea
                    placeholder="Beschreiben Sie den Geltungsbereich des ISMS..."
                    value={scopeDescription}
                    onChange={(e) => setScopeDescription(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                {/* Locations */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    Standorte
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Neuer Standort..."
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddLocation()}
                    />
                    <Button onClick={handleAddLocation} size="icon">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {locations.map((loc, idx) => (
                      <Badge key={idx} variant="secondary" className="gap-1 pr-1">
                        <MapPin className="w-3 h-3" />
                        {loc.name}
                        <button
                          onClick={() => setLocations(locations.filter((_, i) => i !== idx))}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                    {locations.length === 0 && (
                      <p className="text-sm text-muted-foreground">Noch keine Standorte</p>
                    )}
                  </div>
                </div>

                {/* Departments */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    Abteilungen / Bereiche
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Neue Abteilung..."
                      value={newDepartment}
                      onChange={(e) => setNewDepartment(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddDepartment()}
                    />
                    <Button onClick={handleAddDepartment} size="icon">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {departments.map((dept, idx) => (
                      <Badge key={idx} variant="outline" className="gap-1 pr-1">
                        {dept}
                        <button
                          onClick={() => setDepartments(departments.filter((_, i) => i !== idx))}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                    {departments.length === 0 && (
                      <p className="text-sm text-muted-foreground">Noch keine Abteilungen</p>
                    )}
                  </div>
                </div>

                {/* Systems */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Server className="w-4 h-4 text-muted-foreground" />
                    IT-Systeme im Scope
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Neues System..."
                      value={newSystem}
                      onChange={(e) => setNewSystem(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSystem()}
                    />
                    <Button onClick={handleAddSystem} size="icon">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {systems.map((sys, idx) => (
                      <Badge key={idx} variant="outline" className="gap-1 pr-1 bg-blue-50 dark:bg-blue-900/20">
                        <Server className="w-3 h-3" />
                        {sys}
                        <button
                          onClick={() => setSystems(systems.filter((_, i) => i !== idx))}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                    {systems.length === 0 && (
                      <p className="text-sm text-muted-foreground">Noch keine Systeme</p>
                    )}
                  </div>
                </div>

                {/* Exclusions */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <X className="w-4 h-4 text-muted-foreground" />
                    Ausschlüsse
                  </label>
                  <Textarea
                    placeholder="Welche Bereiche oder Anforderungen sind ausgeschlossen und warum?"
                    value={exclusions}
                    onChange={(e) => setExclusions(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              </TabsContent>

              {/* SCHEDULE TAB */}
              <TabsContent value="schedule" className="space-y-6 pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Planned Start */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      Geplanter Audit-Start
                    </label>
                    <Input
                      type="date"
                      value={plannedStartDate}
                      onChange={(e) => setPlannedStartDate(e.target.value)}
                    />
                  </div>

                  {/* Planned End */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      Geplantes Audit-Ende
                    </label>
                    <Input
                      type="date"
                      value={plannedEndDate}
                      onChange={(e) => setPlannedEndDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* Certification Target */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Target className="w-4 h-4 text-emerald-500" />
                    Ziel: Zertifizierungsaudit
                  </label>
                  <Input
                    type="date"
                    value={certificationTargetDate}
                    onChange={(e) => setCertificationTargetDate(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Wann soll das Zertifizierungsaudit durch die externe Stelle stattfinden?
                  </p>
                </div>

                {/* Preparation Notes */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    Vorbereitungs-Notizen
                  </label>
                  <Textarea
                    placeholder="Notizen zur Audit-Vorbereitung, benötigte Unterlagen, etc."
                    value={preparationNotes}
                    onChange={(e) => setPreparationNotes(e.target.value)}
                    className="min-h-[150px]"
                  />
                </div>
              </TabsContent>

              {/* CONTACTS TAB */}
              <TabsContent value="contacts" className="space-y-4 pr-4">
                {/* Existing Contacts */}
                {contacts.length > 0 ? (
                  <div className="space-y-2">
                    {contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {contact.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{contact.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {[contact.role, contact.department].filter(Boolean).join(' • ')}
                          </div>
                          {(contact.email || contact.phone) && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {contact.email} {contact.phone && `• ${contact.phone}`}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteContact(contact.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Noch keine Ansprechpartner</p>
                  </div>
                )}

                {/* Add Contact Form */}
                {showContactForm ? (
                  <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Neuer Ansprechpartner</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setShowContactForm(false)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Name *"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                      />
                      <Input
                        placeholder="Rolle (z.B. ISB)"
                        value={contactRole}
                        onChange={(e) => setContactRole(e.target.value)}
                      />
                      <Input
                        placeholder="Abteilung"
                        value={contactDepartment}
                        onChange={(e) => setContactDepartment(e.target.value)}
                      />
                      <Input
                        placeholder="E-Mail"
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                      />
                      <Input
                        placeholder="Telefon"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setShowContactForm(false)}
                      >
                        Abbrechen
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={handleAddContact}
                        disabled={!contactName.trim()}
                      >
                        Hinzufügen
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => setShowContactForm(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Ansprechpartner hinzufügen
                  </Button>
                )}
              </TabsContent>
            </ScrollArea>

            {/* Save Button */}
            <div className="pt-4 border-t border-border flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Schließen
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Speichern
              </Button>
            </div>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuditPlanningDialog;

