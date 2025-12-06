import { SupportedLanguage } from '@/types/framework';

export const translations: Record<SupportedLanguage, Record<string, string>> = {
  de: {
    // General
    'app.title': 'Audit Companion',
    'app.loading': 'Laden...',
    
    // Header
    'header.progress': 'Fortschritt',
    'header.generateReport': 'Report Generieren',
    'header.editClientName': 'Mandantenname bearbeiten...',
    'header.signOut': 'Abmelden',
    'header.user': 'Benutzer',
    
    // Sidebar
    'sidebar.clauses': 'Klauseln',
    'sidebar.annexA': 'Annex A',
    
    // Audit
    'audit.new': 'Neues Audit',
    'audit.select': 'Audit auswählen',
    'audit.delete': 'Löschen',
    'audit.noAudits': 'Keine Audits vorhanden',
    
    // Create Audit Dialog
    'createAudit.title': 'Neues Audit erstellen',
    'createAudit.description': 'Wählen Sie die Sprache und Frameworks für das neue Audit.',
    'createAudit.language': 'Sprache',
    'createAudit.frameworks': 'Frameworks',
    'createAudit.selectFrameworks': 'Mindestens ein Framework auswählen',
    'createAudit.create': 'Audit erstellen',
    'createAudit.cancel': 'Abbrechen',
    
    // Cockpit
    'cockpit.title': 'Audit-Info',
    'cockpit.creator': 'Ersteller',
    'cockpit.createdAt': 'Erstellt am',
    'cockpit.progress': 'Fortschritt',
    'cockpit.controls': 'Kontrollen',
    'cockpit.timer': 'Timer',
    'cockpit.activity': 'Aktivität',
    'cockpit.team': 'Team',
    
    // Status
    'status.unchecked': 'Nicht geprüft',
    'status.ok': 'Konform',
    'status.ofi': 'Verbesserungspotenzial',
    'status.minorNc': 'Geringfügige Abweichung',
    'status.majorNc': 'Schwerwiegende Abweichung',
    
    // Findings
    'finding.notes': 'Notizen',
    'finding.evidence': 'Nachweise',
    'finding.status': 'Status',
    'finding.questions': 'Prüfungsfragen',
    'finding.purpose': 'Prüfungszweck',
    'finding.correctiveAction': 'Korrekturmaßnahme',
    
    // Settings
    'settings': 'Einstellungen',
    'auditSettings': 'Audit-Einstellungen',
    'auditSettingsDescription': 'Passen Sie Frameworks und Sprache für dieses Audit an.',
    'reportLanguage': 'Report-Sprache',
    'selectFrameworks': 'Frameworks auswählen',
    'selectAtLeastOneFramework': 'Mindestens ein Framework muss ausgewählt sein.',
    'saveChanges': 'Änderungen speichern',
    'cancel': 'Abbrechen',
  },
  en: {
    // General
    'app.title': 'Audit Companion',
    'app.loading': 'Loading...',
    
    // Header
    'header.progress': 'Progress',
    'header.generateReport': 'Generate Report',
    'header.editClientName': 'Edit client name...',
    'header.signOut': 'Sign Out',
    'header.user': 'User',
    
    // Sidebar
    'sidebar.clauses': 'Clauses',
    'sidebar.annexA': 'Annex A',
    
    // Audit
    'audit.new': 'New Audit',
    'audit.select': 'Select Audit',
    'audit.delete': 'Delete',
    'audit.noAudits': 'No audits available',
    
    // Create Audit Dialog
    'createAudit.title': 'Create New Audit',
    'createAudit.description': 'Select the language and frameworks for the new audit.',
    'createAudit.language': 'Language',
    'createAudit.frameworks': 'Frameworks',
    'createAudit.selectFrameworks': 'Select at least one framework',
    'createAudit.create': 'Create Audit',
    'createAudit.cancel': 'Cancel',
    
    // Cockpit
    'cockpit.title': 'Audit Info',
    'cockpit.creator': 'Creator',
    'cockpit.createdAt': 'Created',
    'cockpit.progress': 'Progress',
    'cockpit.controls': 'Controls',
    'cockpit.timer': 'Timer',
    'cockpit.activity': 'Activity',
    'cockpit.team': 'Team',
    
    // Status
    'status.unchecked': 'Not checked',
    'status.ok': 'Compliant',
    'status.ofi': 'Opportunity for Improvement',
    'status.minorNc': 'Minor Non-Conformity',
    'status.majorNc': 'Major Non-Conformity',
    
    // Findings
    'finding.notes': 'Notes',
    'finding.evidence': 'Evidence',
    'finding.status': 'Status',
    'finding.questions': 'Audit Questions',
    'finding.purpose': 'Audit Purpose',
    'finding.correctiveAction': 'Corrective Action',
    
    // Settings
    'settings': 'Settings',
    'auditSettings': 'Audit Settings',
    'auditSettingsDescription': 'Adjust frameworks and language for this audit.',
    'reportLanguage': 'Report Language',
    'selectFrameworks': 'Select Frameworks',
    'selectAtLeastOneFramework': 'At least one framework must be selected.',
    'saveChanges': 'Save Changes',
    'cancel': 'Cancel',
  },
};

export const getTranslation = (language: SupportedLanguage, key: string): string => {
  return translations[language]?.[key] || translations['de'][key] || key;
};
