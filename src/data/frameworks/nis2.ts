import { Framework } from '@/types/framework';

export const nis2Framework: Framework = {
  id: 'nis2',
  name: 'NIS2-Richtlinie (EU 2022/2555)',
  shortName: 'NIS2',
  description: 'EU Directive on Cybersecurity for Critical Infrastructure',
  version: '2022',
  groups: [
    {
      id: 'governance',
      title: 'Governance & Management',
      sections: [
        {
          id: 'NIS2.GOV.1',
          title: 'Art. 20 Governance',
          controls: [
            { id: 'NIS2.GOV.1.1', clause: 'Art. 20.1', title: 'Leitungsverantwortung', isoText: 'Die Leitungsorgane müssen die Cybersicherheitsmaßnahmen genehmigen und deren Umsetzung überwachen.', description: 'Management-Verantwortung für Cybersicherheit.', purpose: 'Top-Level Commitment sicherstellen.', questions: ['Hat die Geschäftsleitung die Cybersicherheitsmaßnahmen genehmigt?', 'Wie wird die Umsetzung überwacht?'], correctiveAction: 'Etablieren Sie formelle Genehmigungsprozesse.' },
            { id: 'NIS2.GOV.1.2', clause: 'Art. 20.2', title: 'Schulung der Leitungsorgane', isoText: 'Leitungsorgane müssen an Schulungen zur Cybersicherheit teilnehmen.', description: 'Pflichtschulungen für Management.', purpose: 'Kompetenz der Führung sicherstellen.', questions: ['Nehmen Führungskräfte an Cybersicherheitsschulungen teil?'], correctiveAction: 'Etablieren Sie Pflichtschulungen für das Management.' },
            { id: 'NIS2.GOV.1.3', clause: 'Art. 20.3', title: 'Mitarbeiterschulung', isoText: 'Regelmäßige Cybersicherheitsschulungen für alle Mitarbeiter.', description: 'Awareness-Programme.', purpose: 'Sensibilisierung aller Mitarbeiter.', questions: ['Gibt es regelmäßige Schulungen für alle Mitarbeiter?'], correctiveAction: 'Führen Sie regelmäßige Awareness-Schulungen durch.' }
          ]
        },
        {
          id: 'NIS2.GOV.2',
          title: 'Art. 21 Risikomanagement',
          controls: [
            { id: 'NIS2.GOV.2.1', clause: 'Art. 21.1', title: 'Risikomanagement-Maßnahmen', isoText: 'Angemessene technische, operative und organisatorische Maßnahmen zum Risikomanagement.', description: 'Umfassendes Risikomanagement.', purpose: 'Cybersicherheitsrisiken managen.', questions: ['Gibt es ein dokumentiertes Risikomanagement?'], correctiveAction: 'Etablieren Sie ein Risikomanagement-System.' },
            { id: 'NIS2.GOV.2.2', clause: 'Art. 21.2a', title: 'Risikoanalyse und Sicherheitskonzepte', isoText: 'Konzepte für Risikoanalyse und Sicherheit von Informationssystemen.', description: 'Dokumentierte Sicherheitskonzepte.', purpose: 'Strukturierte Risikobehandlung.', questions: ['Existieren dokumentierte Sicherheitskonzepte?'], correctiveAction: 'Erstellen Sie Sicherheitskonzepte.' }
          ]
        }
      ]
    },
    {
      id: 'technical-measures',
      title: 'Technische Maßnahmen',
      sections: [
        {
          id: 'NIS2.TECH.1',
          title: 'Art. 21.2b-e Technische Sicherheit',
          controls: [
            { id: 'NIS2.TECH.1.1', clause: 'Art. 21.2b', title: 'Vorfallbehandlung', isoText: 'Bewältigung von Sicherheitsvorfällen.', description: 'Incident Response Prozesse.', purpose: 'Schnelle Reaktion auf Vorfälle.', questions: ['Gibt es dokumentierte Incident-Response-Prozesse?'], correctiveAction: 'Etablieren Sie Incident-Response-Prozesse.' },
            { id: 'NIS2.TECH.1.2', clause: 'Art. 21.2c', title: 'Business Continuity', isoText: 'Aufrechterhaltung des Betriebs und Krisenmanagement.', description: 'BCM und Notfallplanung.', purpose: 'Betriebskontinuität sicherstellen.', questions: ['Gibt es einen Business-Continuity-Plan?'], correctiveAction: 'Erstellen Sie einen BCM-Plan.' },
            { id: 'NIS2.TECH.1.3', clause: 'Art. 21.2d', title: 'Lieferkettensicherheit', isoText: 'Sicherheit in der Lieferkette.', description: 'Supply Chain Security.', purpose: 'Risiken durch Dritte minimieren.', questions: ['Wie wird die Lieferkettensicherheit gewährleistet?'], correctiveAction: 'Implementieren Sie Supply-Chain-Sicherheitsmaßnahmen.' },
            { id: 'NIS2.TECH.1.4', clause: 'Art. 21.2e', title: 'Beschaffungssicherheit', isoText: 'Sicherheit bei Erwerb, Entwicklung und Wartung von Systemen.', description: 'Secure Development Lifecycle.', purpose: 'Sicherheit von Anfang an.', questions: ['Gibt es Sicherheitsanforderungen in der Beschaffung?'], correctiveAction: 'Integrieren Sie Sicherheit in Beschaffungsprozesse.' }
          ]
        },
        {
          id: 'NIS2.TECH.2',
          title: 'Art. 21.2f-j Weitere Maßnahmen',
          controls: [
            { id: 'NIS2.TECH.2.1', clause: 'Art. 21.2f', title: 'Wirksamkeitsbewertung', isoText: 'Bewertung der Wirksamkeit von Cybersicherheitsmaßnahmen.', description: 'Regelmäßige Überprüfungen.', purpose: 'Kontinuierliche Verbesserung.', questions: ['Wie wird die Wirksamkeit bewertet?'], correctiveAction: 'Etablieren Sie Wirksamkeitsprüfungen.' },
            { id: 'NIS2.TECH.2.2', clause: 'Art. 21.2g', title: 'Cyberhygiene und Schulung', isoText: 'Grundlegende Cyberhygiene-Praktiken und Schulungen.', description: 'Basis-Sicherheitspraktiken.', purpose: 'Grundschutz gewährleisten.', questions: ['Gibt es Cyberhygiene-Richtlinien?'], correctiveAction: 'Definieren Sie Cyberhygiene-Standards.' },
            { id: 'NIS2.TECH.2.3', clause: 'Art. 21.2h', title: 'Kryptographie', isoText: 'Einsatz von Kryptographie und Verschlüsselung.', description: 'Verschlüsselungsmaßnahmen.', purpose: 'Vertraulichkeit schützen.', questions: ['Wird Verschlüsselung eingesetzt?'], correctiveAction: 'Implementieren Sie Verschlüsselung.' },
            { id: 'NIS2.TECH.2.4', clause: 'Art. 21.2i', title: 'Personalsicherheit und Zugriffskontrolle', isoText: 'Sicherheit des Personals und Zugriffskontrollkonzepte.', description: 'HR-Security und Access Control.', purpose: 'Zugriffe kontrollieren.', questions: ['Gibt es Zugriffskontrollrichtlinien?'], correctiveAction: 'Etablieren Sie Zugriffskontrollen.' },
            { id: 'NIS2.TECH.2.5', clause: 'Art. 21.2j', title: 'Multi-Faktor-Authentifizierung', isoText: 'Verwendung von MFA und sicherer Kommunikation.', description: 'Starke Authentifizierung.', purpose: 'Identitäten schützen.', questions: ['Wird MFA eingesetzt?'], correctiveAction: 'Implementieren Sie MFA.' }
          ]
        }
      ]
    },
    {
      id: 'incident-reporting',
      title: 'Meldepflichten',
      sections: [
        {
          id: 'NIS2.REPORT.1',
          title: 'Art. 23 Meldepflichten',
          controls: [
            { id: 'NIS2.REPORT.1.1', clause: 'Art. 23.1', title: 'Frühwarnung', isoText: 'Frühwarnung innerhalb von 24 Stunden nach Kenntnisnahme.', description: '24h-Meldepflicht.', purpose: 'Schnelle Information der Behörden.', questions: ['Können Sie innerhalb von 24h melden?'], correctiveAction: 'Etablieren Sie einen 24h-Meldeprozess.' },
            { id: 'NIS2.REPORT.1.2', clause: 'Art. 23.2', title: 'Vorfallmeldung', isoText: 'Ausführliche Meldung innerhalb von 72 Stunden.', description: '72h-Detailmeldung.', purpose: 'Vollständige Information.', questions: ['Gibt es einen Prozess für die 72h-Meldung?'], correctiveAction: 'Definieren Sie den Meldeprozess.' },
            { id: 'NIS2.REPORT.1.3', clause: 'Art. 23.3', title: 'Abschlussbericht', isoText: 'Abschlussbericht innerhalb eines Monats.', description: 'Finaler Vorfallbericht.', purpose: 'Lessons Learned dokumentieren.', questions: ['Werden Abschlussberichte erstellt?'], correctiveAction: 'Etablieren Sie Abschlussberichtsprozesse.' }
          ]
        }
      ]
    }
  ]
};
