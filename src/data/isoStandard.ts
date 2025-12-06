import { IsoSection } from '@/types/audit';

export const isoStandardData: IsoSection[] = [
  // ISO 27001 Management System Clauses (4-10)
  {
    id: 'Clause.4',
    title: 'Klausel 4: Kontext der Organisation',
    controls: [
      {
        id: '4.1',
        clause: '4.1',
        title: 'Verstehen der Organisation und ihres Kontextes',
        isoText: 'Bestimmung interner und externer Themen, die für das ISMS relevant sind.',
        description: 'Das Unternehmen muss seinen Kontext verstehen, einschließlich interner und externer Faktoren.',
        purpose: 'Wir prüfen, ob Sie Ihre Geschäftsumgebung und relevante Einflussfaktoren kennen.',
        questions: ['Haben Sie eine Kontextanalyse durchgeführt?', 'Welche externen und internen Faktoren beeinflussen Ihre IS?'],
        correctiveAction: 'Führen Sie eine dokumentierte Kontextanalyse durch.'
      },
      {
        id: '4.2',
        clause: '4.2',
        title: 'Verstehen der Erfordernisse und Erwartungen interessierter Parteien',
        isoText: 'Bestimmung relevanter interessierter Parteien und ihrer Anforderungen.',
        description: 'Stakeholder und ihre Anforderungen an die IS müssen identifiziert werden.',
        purpose: 'Wer stellt Anforderungen an Ihre Informationssicherheit?',
        questions: ['Wer sind Ihre interessierten Parteien?', 'Welche Anforderungen stellen diese?'],
        correctiveAction: 'Erstellen Sie eine Liste interessierter Parteien mit ihren IS-Anforderungen.'
      },
      {
        id: '4.3',
        clause: '4.3',
        title: 'Festlegen des Anwendungsbereichs des ISMS',
        isoText: 'Definition der Grenzen und Anwendbarkeit des ISMS.',
        description: 'Der Geltungsbereich des ISMS muss klar definiert sein.',
        purpose: 'Der Scope Ihres ISMS muss klar abgegrenzt sein.',
        questions: ['Ist der ISMS-Anwendungsbereich dokumentiert?', 'Gibt es begründete Ausschlüsse?'],
        correctiveAction: 'Dokumentieren Sie den ISMS-Anwendungsbereich mit klaren Grenzen.'
      },
      {
        id: '4.4',
        clause: '4.4',
        title: 'Informationssicherheitsmanagementsystem',
        isoText: 'Aufbau, Verwirklichung, Aufrechterhaltung und fortlaufende Verbesserung des ISMS.',
        description: 'Das ISMS muss etabliert und kontinuierlich verbessert werden.',
        purpose: 'Ihr ISMS muss als fortlaufendes System etabliert sein.',
        questions: ['Ist Ihr ISMS formell etabliert?', 'Gibt es einen PDCA-Zyklus?'],
        correctiveAction: 'Etablieren Sie ein formelles ISMS mit kontinuierlichem Verbesserungsprozess.'
      }
    ]
  },
  {
    id: 'Clause.5',
    title: 'Klausel 5: Führung',
    controls: [
      {
        id: '5.1',
        clause: '5.1',
        title: 'Führung und Verpflichtung',
        isoText: 'Die oberste Leitung muss Führung und Verpflichtung für das ISMS zeigen.',
        description: 'Das Top-Management muss aktiv die IS unterstützen.',
        purpose: 'Die Geschäftsleitung muss sichtbar hinter der IS stehen.',
        questions: ['Wie demonstriert die Geschäftsleitung ihr Engagement?', 'Werden ausreichend Ressourcen bereitgestellt?'],
        correctiveAction: 'Dokumentieren Sie das Management-Engagement und etablieren Sie regelmäßige Reviews.'
      },
      {
        id: '5.2',
        clause: '5.2',
        title: 'Politik',
        isoText: 'Festlegung und Kommunikation der Informationssicherheitspolitik durch die oberste Leitung.',
        description: 'Eine übergeordnete IS-Politik muss vom Management verabschiedet werden.',
        purpose: 'Eine klare IS-Politik gibt die Richtung vor.',
        questions: ['Gibt es eine vom Management genehmigte IS-Politik?', 'Ist diese allen Mitarbeitern bekannt?'],
        correctiveAction: 'Erstellen und kommunizieren Sie eine vom Management genehmigte IS-Politik.'
      },
      {
        id: '5.3',
        clause: '5.3',
        title: 'Rollen, Verantwortlichkeiten und Befugnisse in der Organisation',
        isoText: 'Zuweisung und Bekanntmachung von Verantwortlichkeiten und Befugnissen für IS-Rollen.',
        description: 'IS-Rollen und Verantwortlichkeiten müssen klar zugewiesen sein.',
        purpose: 'Klare Verantwortlichkeiten sind essentiell.',
        questions: ['Sind IS-Rollen formal zugewiesen?', 'Gibt es einen ISB/CISO?'],
        correctiveAction: 'Weisen Sie IS-Rollen formal zu und dokumentieren Sie die Verantwortlichkeiten.'
      }
    ]
  },
  {
    id: 'Clause.6',
    title: 'Klausel 6: Planung',
    controls: [
      {
        id: '6.1',
        clause: '6.1',
        title: 'Maßnahmen zum Umgang mit Risiken und Chancen',
        isoText: 'Bestimmung und Planung von Maßnahmen zur Behandlung von Risiken und Chancen für das ISMS.',
        description: 'Risiken und Chancen müssen identifiziert und behandelt werden.',
        purpose: 'Risikomanagement ist das Herzstück des ISMS.',
        questions: ['Haben Sie einen dokumentierten Risikomanagement-Prozess?', 'Gibt es ein Risikoregister?'],
        correctiveAction: 'Etablieren Sie einen formellen Risikomanagement-Prozess.'
      },
      {
        id: '6.1.2',
        clause: '6.1.2',
        title: 'Informationssicherheitsrisikobeurteilung',
        isoText: 'Festlegung eines Prozesses zur Identifizierung, Analyse und Bewertung von Risiken.',
        description: 'Ein strukturierter Prozess zur Risikobeurteilung muss existieren.',
        purpose: 'Risiken müssen systematisch identifiziert und bewertet werden.',
        questions: ['Wie identifizieren Sie IS-Risiken?', 'Nach welchen Kriterien bewerten Sie Risiken?'],
        correctiveAction: 'Definieren Sie einen dokumentierten Risikobeurteilungsprozess.'
      },
      {
        id: '6.1.3',
        clause: '6.1.3',
        title: 'Informationssicherheitsrisikobehandlung',
        isoText: 'Festlegung und Anwendung eines Prozesses zur Auswahl und Umsetzung von Risiko-Behandlungsoptionen.',
        description: 'Für identifizierte Risiken müssen Behandlungsoptionen gewählt werden.',
        purpose: 'Risiken müssen behandelt werden: vermeiden, vermindern, übertragen oder akzeptieren.',
        questions: ['Wie wählen Sie Risikobehandlungsoptionen?', 'Gibt es einen Risikobehandlungsplan?'],
        correctiveAction: 'Erstellen Sie einen dokumentierten Risikobehandlungsplan.'
      },
      {
        id: '6.2',
        clause: '6.2',
        title: 'Informationssicherheitsziele und Planung zu deren Erreichung',
        isoText: 'Festlegung messbarer IS-Ziele und Planung ihrer Erreichung.',
        description: 'Messbare IS-Ziele müssen definiert und verfolgt werden.',
        purpose: 'Ohne klare Ziele ist Erfolg nicht messbar.',
        questions: ['Haben Sie dokumentierte IS-Ziele?', 'Sind diese messbar und terminiert?'],
        correctiveAction: 'Definieren Sie SMART-IS-Ziele und etablieren Sie ein Tracking.'
      },
      {
        id: '6.3',
        clause: '6.3',
        title: 'Planung von Änderungen',
        isoText: 'Durchführung von Änderungen am ISMS in geplanter Weise.',
        description: 'Änderungen am ISMS müssen geplant und kontrolliert erfolgen.',
        purpose: 'Änderungen am ISMS müssen strukturiert erfolgen.',
        questions: ['Wie werden Änderungen am ISMS geplant?', 'Werden Auswirkungen bewertet?'],
        correctiveAction: 'Etablieren Sie einen Change-Management-Prozess für ISMS-Änderungen.'
      }
    ]
  },
  {
    id: 'Clause.7',
    title: 'Klausel 7: Unterstützung',
    controls: [
      {
        id: '7.1',
        clause: '7.1',
        title: 'Ressourcen',
        isoText: 'Bestimmung und Bereitstellung der erforderlichen Ressourcen für das ISMS.',
        description: 'Ausreichende Ressourcen müssen für das ISMS verfügbar sein.',
        purpose: 'Ohne ausreichende Ressourcen kann kein ISMS funktionieren.',
        questions: ['Gibt es ein dediziertes IS-Budget?', 'Sind ausreichend Personalressourcen vorhanden?'],
        correctiveAction: 'Stellen Sie ausreichende Ressourcen für das ISMS bereit.'
      },
      {
        id: '7.2',
        clause: '7.2',
        title: 'Kompetenz',
        isoText: 'Sicherstellung der erforderlichen Kompetenz des Personals.',
        description: 'Mitarbeiter mit IS-relevanten Aufgaben müssen kompetent sein.',
        purpose: 'IS-Personal muss die nötige Kompetenz haben.',
        questions: ['Wie stellen Sie die Kompetenz Ihres IS-Personals sicher?', 'Gibt es Schulungspläne?'],
        correctiveAction: 'Definieren Sie Kompetenzanforderungen und etablieren Sie Schulungsprogramme.'
      },
      {
        id: '7.3',
        clause: '7.3',
        title: 'Bewusstsein',
        isoText: 'Sicherstellung, dass sich das Personal der Politik und ihres Beitrags bewusst ist.',
        description: 'Alle Mitarbeiter müssen IS-bewusst sein.',
        purpose: 'Awareness ist entscheidend für die IS.',
        questions: ['Wie stellen Sie das IS-Bewusstsein sicher?', 'Kennen alle Mitarbeiter die IS-Politik?'],
        correctiveAction: 'Etablieren Sie ein Awareness-Programm für alle Mitarbeiter.'
      },
      {
        id: '7.4',
        clause: '7.4',
        title: 'Kommunikation',
        isoText: 'Bestimmung der Erfordernisse für interne und externe Kommunikation.',
        description: 'IS-Kommunikation muss geplant und strukturiert erfolgen.',
        purpose: 'Kommunikation ist wichtig für ein funktionierendes ISMS.',
        questions: ['Wie kommunizieren Sie IS-Themen intern?', 'Gibt es einen Kommunikationsplan?'],
        correctiveAction: 'Erstellen Sie einen IS-Kommunikationsplan.'
      },
      {
        id: '7.5',
        clause: '7.5',
        title: 'Dokumentierte Information',
        isoText: 'Anforderungen an die Art und Steuerung der vom ISMS geforderten Dokumentation.',
        description: 'ISMS-Dokumentation muss vollständig und kontrolliert sein.',
        purpose: 'Dokumentation ist die Grundlage für Audits.',
        questions: ['Haben Sie ein Dokumentenlenkungsverfahren?', 'Sind alle geforderten Dokumente vorhanden?'],
        correctiveAction: 'Etablieren Sie ein Dokumentenlenkungsverfahren.'
      }
    ]
  },
  {
    id: 'Clause.8',
    title: 'Klausel 8: Betrieb',
    controls: [
      {
        id: '8.1',
        clause: '8.1',
        title: 'Betriebliche Planung und Steuerung',
        isoText: 'Planung, Verwirklichung und Steuerung der Prozesse und Maßnahmen des ISMS.',
        description: 'IS-Prozesse müssen geplant und gesteuert werden.',
        purpose: 'Der IS-Betrieb muss strukturiert erfolgen.',
        questions: ['Sind Ihre IS-Prozesse dokumentiert?', 'Gibt es KPIs für IS-Prozesse?'],
        correctiveAction: 'Dokumentieren und steuern Sie alle IS-relevanten Prozesse.'
      },
      {
        id: '8.2',
        clause: '8.2',
        title: 'Informationssicherheitsrisikobeurteilung',
        isoText: 'Durchführung von Risikobeurteilungen in geplanten Abständen oder bei signifikanten Änderungen.',
        description: 'Regelmäßige Risikobewertungen sind durchzuführen.',
        purpose: 'Risiken müssen regelmäßig neu bewertet werden.',
        questions: ['Wie oft führen Sie Risikobeurteilungen durch?', 'Bei welchen Änderungen wird neu bewertet?'],
        correctiveAction: 'Führen Sie regelmäßige, dokumentierte Risikobeurteilungen durch.'
      },
      {
        id: '8.3',
        clause: '8.3',
        title: 'Informationssicherheitsrisikobehandlung',
        isoText: 'Umsetzung des Plans für die Informationssicherheitsrisikobehandlung.',
        description: 'Identifizierte Risiken müssen behandelt werden.',
        purpose: 'Risiken müssen aktiv behandelt werden.',
        questions: ['Haben Sie einen Risikobehandlungsplan?', 'Wie wird der Fortschritt verfolgt?'],
        correctiveAction: 'Erstellen und verfolgen Sie einen Risikobehandlungsplan.'
      }
    ]
  },
  {
    id: 'Clause.9',
    title: 'Klausel 9: Bewertung der Leistung',
    controls: [
      {
        id: '9.1',
        clause: '9.1',
        title: 'Überwachung, Messung, Analyse und Bewertung',
        isoText: 'Bestimmung und Durchführung der Überwachung, Messung, Analyse und Bewertung der IS-Leistung.',
        description: 'Die ISMS-Leistung muss gemessen und bewertet werden.',
        purpose: 'Was nicht gemessen wird, kann nicht verbessert werden.',
        questions: ['Welche IS-Metriken verwenden Sie?', 'Gibt es regelmäßige Auswertungen?'],
        correctiveAction: 'Definieren Sie IS-Metriken und führen Sie regelmäßige Auswertungen durch.'
      },
      {
        id: '9.2',
        clause: '9.2',
        title: 'Internes Audit',
        isoText: 'Durchführung geplanter Audits zur Überprüfung der Konformität und Wirksamkeit des ISMS.',
        description: 'Interne ISMS-Audits müssen regelmäßig durchgeführt werden.',
        purpose: 'Interne Audits prüfen die ISMS-Konformität.',
        questions: ['Führen Sie regelmäßige interne IS-Audits durch?', 'Gibt es ein Audit-Programm?'],
        correctiveAction: 'Etablieren Sie ein internes Audit-Programm mit qualifizierten Auditoren.'
      },
      {
        id: '9.3',
        clause: '9.3',
        title: 'Managementbewertung',
        isoText: 'Bewertung des ISMS durch die oberste Leitung in geplanten Abständen.',
        description: 'Regelmäßige Management-Reviews des ISMS sind erforderlich.',
        purpose: 'Das Management muss das ISMS regelmäßig bewerten.',
        questions: ['Finden regelmäßige Management-Reviews statt?', 'Werden Ergebnisse dokumentiert?'],
        correctiveAction: 'Etablieren Sie regelmäßige Management-Reviews mit dokumentierten Ergebnissen.'
      }
    ]
  },
  {
    id: 'Clause.10',
    title: 'Klausel 10: Verbesserung',
    controls: [
      {
        id: '10.1',
        clause: '10.1',
        title: 'Fortlaufende Verbesserung',
        isoText: 'Kontinuierliche Verbesserung der Eignung, Angemessenheit und Wirksamkeit des ISMS.',
        description: 'Das ISMS muss kontinuierlich verbessert werden.',
        purpose: 'Kontinuierliche Verbesserung ist Kern des ISMS.',
        questions: ['Wie stellen Sie kontinuierliche Verbesserung sicher?', 'Gibt es einen KVP-Prozess?'],
        correctiveAction: 'Etablieren Sie einen dokumentierten KVP-Prozess für das ISMS.'
      },
      {
        id: '10.2',
        clause: '10.2',
        title: 'Nichtkonformität und Korrekturmaßnahmen',
        isoText: 'Reaktion auf Nichtkonformitäten und Ergreifen von Maßnahmen zur Beseitigung ihrer Ursachen.',
        description: 'Nichtkonformitäten müssen behandelt und Korrekturmaßnahmen ergriffen werden.',
        purpose: 'Aus Fehlern muss gelernt werden.',
        questions: ['Wie gehen Sie mit Nichtkonformitäten um?', 'Werden Ursachen analysiert?'],
        correctiveAction: 'Etablieren Sie einen Prozess für Korrekturmaßnahmen mit Ursachenanalyse.'
      }
    ]
  },
  // Annex A Controls - A.5 Organisatorische Maßnahmen (37 Kontrollen)
  {
    id: 'A.5',
    title: 'A.5 Organisatorische Maßnahmen',
    controls: [
      { id: 'A.5.1', clause: 'A.5.1', title: 'Informationssicherheitspolitik und -richtlinien', isoText: 'Festlegen, Genehmigen, Veröffentlichen und Überprüfen der IS-Politik und themenspezifischer Richtlinien.', description: 'Dokumentierte Richtlinien für Informationssicherheit.', purpose: 'Klare Regeln für den Umgang mit Informationen.', questions: ['Haben Sie eine dokumentierte IS-Richtlinie?', 'Wann wurde sie zuletzt überprüft?'], correctiveAction: 'Erstellen und kommunizieren Sie eine IS-Politik.' },
      { id: 'A.5.2', clause: 'A.5.2', title: 'Informationssicherheitsrollen und -verantwortlichkeiten', isoText: 'Definieren und Zuweisen von Aufgaben und Zuständigkeiten im Bereich der IS.', description: 'Klare Zuständigkeiten für IS.', purpose: 'Wer ist wofür verantwortlich?', questions: ['Gibt es einen ISB/CISO?', 'Sind Rollen dokumentiert?'], correctiveAction: 'Definieren Sie IS-Rollen in einer RACI-Matrix.' },
      { id: 'A.5.3', clause: 'A.5.3', title: 'Aufgabentrennung', isoText: 'Sich widersprechende Aufgaben und Verantwortungsbereiche trennen.', description: 'Vier-Augen-Prinzip für kritische Aufgaben.', purpose: 'Keine Einzelperson soll alleine kritische Aktionen durchführen.', questions: ['Gibt es ein Vier-Augen-Prinzip?', 'Wie werden Konflikte identifiziert?'], correctiveAction: 'Implementieren Sie Aufgabentrennung für kritische Prozesse.' },
      { id: 'A.5.4', clause: 'A.5.4', title: 'Verantwortlichkeiten der Leitung', isoText: 'Umsetzung der IS-Politik durch das Personal sicherstellen.', description: 'Management muss Einhaltung fördern.', purpose: 'Management-Engagement ist essentiell.', questions: ['Wie fördert das Management IS?', 'Gibt es Konsequenzen bei Verstößen?'], correctiveAction: 'Etablieren Sie Management-Reviews.' },
      { id: 'A.5.5', clause: 'A.5.5', title: 'Kontakt mit Behörden', isoText: 'Kontakt mit zuständigen Behörden aufnehmen und halten.', description: 'Behördenkontakte für Notfälle.', purpose: 'Im Ernstfall schnell reagieren können.', questions: ['Haben Sie eine Behördenkontaktliste?', 'Kennen Sie Ihre Meldepflichten?'], correctiveAction: 'Erstellen Sie eine aktuelle Behördenkontaktliste.' },
      { id: 'A.5.6', clause: 'A.5.6', title: 'Kontakt mit speziellen Interessensgruppen', isoText: 'Kontakt mit sicherheitsorientierten Expertenforen und Fachverbänden halten.', description: 'Austausch mit Security-Communities.', purpose: 'Auf dem neuesten Stand bleiben.', questions: ['Sind Sie in Fachgruppen aktiv?', 'Wie informieren Sie sich über Bedrohungen?'], correctiveAction: 'Treten Sie relevanten Fachgruppen bei.' },
      { id: 'A.5.7', clause: 'A.5.7', title: 'Informationen über die Bedrohungslage', isoText: 'Sammeln und Analysieren von Informationen über Bedrohungen der IS.', description: 'Proaktive Threat Intelligence.', purpose: 'Bedrohungen frühzeitig erkennen.', questions: ['Haben Sie einen Threat-Intelligence-Prozess?', 'Welche Quellen nutzen Sie?'], correctiveAction: 'Etablieren Sie einen Threat-Intelligence-Prozess.' },
      { id: 'A.5.8', clause: 'A.5.8', title: 'Informationssicherheit im Projektmanagement', isoText: 'Integration der IS in das Projektmanagement.', description: 'Security by Design.', purpose: 'Sicherheit von Anfang an einplanen.', questions: ['Wie werden IS-Anforderungen in Projekten berücksichtigt?', 'Gibt es Security-Gates?'], correctiveAction: 'Integrieren Sie Sicherheits-Checkpoints in Projekte.' },
      { id: 'A.5.9', clause: 'A.5.9', title: 'Inventar der Informationen und anderen damit verbundenen Werte', isoText: 'Erstellen und Pflegen eines Inventars von Werten und Eigentümern.', description: 'Asset-Inventar mit Verantwortlichen.', purpose: 'Wissen, was zu schützen ist.', questions: ['Haben Sie ein Asset-Inventar?', 'Sind Eigentümer zugewiesen?'], correctiveAction: 'Erstellen Sie ein vollständiges Asset-Inventar.' },
      { id: 'A.5.10', clause: 'A.5.10', title: 'Zulässiger Gebrauch von Informationen und anderen damit verbundenen Werten', isoText: 'Aufstellen von Regeln für den zulässigen Gebrauch und den Umgang mit Werten.', description: 'Nutzungsrichtlinien für Assets.', purpose: 'Klare Regeln für den Umgang mit Assets.', questions: ['Gibt es Acceptable Use Policies?', 'Sind diese allen bekannt?'], correctiveAction: 'Erstellen Sie Acceptable Use Policies.' },
      { id: 'A.5.11', clause: 'A.5.11', title: 'Rückgabe von Werten', isoText: 'Rückgabe aller Werte der Organisation durch das Personal bei Beendigung des Verhältnisses.', description: 'Assets bei Austritt zurückfordern.', purpose: 'Keine Assets gehen verloren.', questions: ['Gibt es einen Offboarding-Prozess?', 'Werden alle Geräte zurückgefordert?'], correctiveAction: 'Implementieren Sie eine Offboarding-Checkliste.' },
      { id: 'A.5.12', clause: 'A.5.12', title: 'Klassifizierung von Informationen', isoText: 'Klassifizieren von Informationen nach Vertraulichkeit, Integrität, Verfügbarkeit und relevanten Anforderungen.', description: 'Informationsklassifizierungsschema.', purpose: 'Unterschiedliche Schutzbedarfe erkennen.', questions: ['Haben Sie ein Klassifizierungsschema?', 'Wird es angewendet?'], correctiveAction: 'Definieren Sie ein Klassifizierungsschema.' },
      { id: 'A.5.13', clause: 'A.5.13', title: 'Kennzeichnung von Informationen', isoText: 'Entwickeln und Umsetzen von Verfahren zur Kennzeichnung von Informationen gemäß Klassifizierung.', description: 'Informationen entsprechend kennzeichnen.', purpose: 'Schutzbedarf sichtbar machen.', questions: ['Wie werden Informationen gekennzeichnet?', 'Gibt es Vorlagen/Tools?'], correctiveAction: 'Implementieren Sie ein Kennzeichnungsverfahren.' },
      { id: 'A.5.14', clause: 'A.5.14', title: 'Informationsübermittlung', isoText: 'Festlegen von Regeln, Verfahren oder Vereinbarungen für die Informationsübermittlung.', description: 'Sichere Übertragung von Informationen.', purpose: 'Informationen sicher übermitteln.', questions: ['Wie werden sensible Daten übertragen?', 'Gibt es Verschlüsselungsvorgaben?'], correctiveAction: 'Definieren Sie sichere Übertragungsverfahren.' },
      { id: 'A.5.15', clause: 'A.5.15', title: 'Zugangssteuerung', isoText: 'Aufstellen und Umsetzen von Regeln zur Steuerung des physischen und logischen Zugriffs.', description: 'Zugriffsrichtlinien.', purpose: 'Wer darf auf was zugreifen?', questions: ['Haben Sie eine Zugangssteuerungsrichtlinie?', 'Wird diese durchgesetzt?'], correctiveAction: 'Erstellen Sie eine Zugangssteuerungsrichtlinie.' },
      { id: 'A.5.16', clause: 'A.5.16', title: 'Identitätsmanagement', isoText: 'Verwalten des gesamten Lebenszyklus von Identitäten.', description: 'Verwaltung von Benutzeridentitäten.', purpose: 'Identitäten über den gesamten Lebenszyklus verwalten.', questions: ['Wie werden Identitäten verwaltet?', 'Gibt es ein IAM-System?'], correctiveAction: 'Implementieren Sie Identity Management.' },
      { id: 'A.5.17', clause: 'A.5.17', title: 'Authentisierungsinformationen', isoText: 'Steuerung der Zuweisung und Verwaltung von Authentisierungsinformationen.', description: 'Verwaltung von Passwörtern und Credentials.', purpose: 'Sichere Verwaltung von Zugangsdaten.', questions: ['Wie werden Passwörter verwaltet?', 'Gibt es Passwort-Richtlinien?'], correctiveAction: 'Definieren Sie Passwort-Richtlinien.' },
      { id: 'A.5.18', clause: 'A.5.18', title: 'Zugangsrechte', isoText: 'Bereitstellen, Überprüfen, Ändern und Entfernen von Zugangsrechten gemäß Richtlinie.', description: 'Verwaltung von Zugriffsrechten.', purpose: 'Rechte nach Bedarf vergeben und entziehen.', questions: ['Wie werden Zugriffsrechte vergeben?', 'Werden diese regelmäßig überprüft?'], correctiveAction: 'Etablieren Sie einen Berechtigungsmanagement-Prozess.' },
      { id: 'A.5.19', clause: 'A.5.19', title: 'Informationssicherheit in Lieferantenbeziehungen', isoText: 'Festlegen und Umsetzen von Prozessen zur Beherrschung der IS-Risiken aus Lieferantenprodukten.', description: 'IS-Anforderungen an Lieferanten.', purpose: 'Lieferanten in die IS einbeziehen.', questions: ['Wie bewerten Sie Lieferantenrisiken?', 'Gibt es IS-Klauseln in Verträgen?'], correctiveAction: 'Etablieren Sie einen Lieferanten-Risikomanagement-Prozess.' },
      { id: 'A.5.20', clause: 'A.5.20', title: 'Behandlung von IS in Lieferantenvereinbarungen', isoText: 'Festlegen und Vereinbaren von IS-Anforderungen mit jedem Lieferanten.', description: 'IS-Anforderungen vertraglich regeln.', purpose: 'Verbindliche IS-Vereinbarungen mit Lieferanten.', questions: ['Enthalten Ihre Verträge IS-Klauseln?', 'Werden diese durchgesetzt?'], correctiveAction: 'Ergänzen Sie Verträge um IS-Anforderungen.' },
      { id: 'A.5.21', clause: 'A.5.21', title: 'Umgang mit IS in der IKT-Lieferkette', isoText: 'Prozesse zur Beherrschung der IS-Risiken in der IKT-Lieferkette festlegen und umsetzen.', description: 'Supply-Chain-Sicherheit.', purpose: 'Die gesamte Lieferkette absichern.', questions: ['Wie bewerten Sie Risiken in der Lieferkette?', 'Gibt es Audits bei Lieferanten?'], correctiveAction: 'Etablieren Sie Supply-Chain-Sicherheitsmaßnahmen.' },
      { id: 'A.5.22', clause: 'A.5.22', title: 'Überwachung, Überprüfung und Änderungsmanagement von Lieferantendienstleistungen', isoText: 'Regelmäßiges Überwachen, Überprüfen, Bewerten und Steuern von Änderungen der Lieferantendienstleistungen.', description: 'Lieferanten-Performance überwachen.', purpose: 'Lieferantenleistung kontinuierlich bewerten.', questions: ['Wie überwachen Sie Lieferanten?', 'Gibt es regelmäßige Reviews?'], correctiveAction: 'Etablieren Sie regelmäßige Lieferanten-Reviews.' },
      { id: 'A.5.23', clause: 'A.5.23', title: 'Informationssicherheit für die Nutzung von Cloud-Diensten', isoText: 'Festlegen von Verfahren für Erwerb, Nutzung, Verwaltung und Ausstieg aus Cloud-Diensten.', description: 'Cloud-Sicherheit.', purpose: 'Cloud-Dienste sicher nutzen.', questions: ['Wie bewerten Sie Cloud-Anbieter?', 'Gibt es Exit-Strategien?'], correctiveAction: 'Etablieren Sie Cloud-Governance-Prozesse.' },
      { id: 'A.5.24', clause: 'A.5.24', title: 'Planung und Vorbereitung der Handhabung von IS-Vorfällen', isoText: 'Prozesse, Rollen und Verantwortlichkeiten für die Vorfallbehandlung definieren und kommunizieren.', description: 'Incident-Response-Planung.', purpose: 'Auf Vorfälle vorbereitet sein.', questions: ['Haben Sie einen Incident-Response-Plan?', 'Sind Rollen definiert?'], correctiveAction: 'Erstellen Sie einen Incident-Response-Plan.' },
      { id: 'A.5.25', clause: 'A.5.25', title: 'Beurteilung und Entscheidung über IS-Ereignisse', isoText: 'Beurteilen von Ereignissen und Entscheiden, ob sie als Vorfall eingestuft werden müssen.', description: 'Ereignisse klassifizieren.', purpose: 'Ereignisse richtig einordnen.', questions: ['Wie klassifizieren Sie Ereignisse?', 'Wer entscheidet über Eskalation?'], correctiveAction: 'Definieren Sie Kriterien für Vorfallklassifizierung.' },
      { id: 'A.5.26', clause: 'A.5.26', title: 'Reaktion auf IS-Vorfälle', isoText: 'Auf Vorfälle entsprechend den dokumentierten Verfahren reagieren.', description: 'Vorfallreaktion.', purpose: 'Strukturiert auf Vorfälle reagieren.', questions: ['Wie reagieren Sie auf Vorfälle?', 'Gibt es Playbooks?'], correctiveAction: 'Erstellen Sie Incident-Response-Playbooks.' },
      { id: 'A.5.27', clause: 'A.5.27', title: 'Erkenntnisse aus IS-Vorfällen', isoText: 'Nutzung gewonnener Erkenntnisse zur Verbesserung der IS-Maßnahmen.', description: 'Lessons Learned.', purpose: 'Aus Vorfällen lernen.', questions: ['Werden Lessons Learned durchgeführt?', 'Wie fließen Erkenntnisse ein?'], correctiveAction: 'Etablieren Sie einen Lessons-Learned-Prozess.' },
      { id: 'A.5.28', clause: 'A.5.28', title: 'Sammeln von Beweismaterial', isoText: 'Einführen und Umsetzen von Verfahren für Ermittlung und Aufbewahrung von Beweismaterial.', description: 'Forensik und Beweissicherung.', purpose: 'Beweise gerichtsfest sichern.', questions: ['Haben Sie Verfahren zur Beweissicherung?', 'Wie werden Beweise aufbewahrt?'], correctiveAction: 'Definieren Sie Forensik-Verfahren.' },
      { id: 'A.5.29', clause: 'A.5.29', title: 'IS bei Störungen', isoText: 'Planen, wie die IS während einer Störung aufrechterhalten wird.', description: 'IS während Krisen.', purpose: 'Auch in Krisen sicher bleiben.', questions: ['Wie wird IS bei Störungen gewährleistet?', 'Gibt es Notfallpläne?'], correctiveAction: 'Integrieren Sie IS in Ihre BCM-Pläne.' },
      { id: 'A.5.30', clause: 'A.5.30', title: 'IKT-Bereitschaft für Business-Continuity', isoText: 'Planen, Umsetzen, Aufrechterhalten und Prüfen der IKT-Bereitschaft auf Basis der BC-Ziele.', description: 'IT-Kontinuitätsplanung.', purpose: 'IT auch bei Ausfällen verfügbar halten.', questions: ['Haben Sie einen IT-Notfallplan?', 'Werden DR-Tests durchgeführt?'], correctiveAction: 'Erstellen und testen Sie IT-Notfallpläne.' },
      { id: 'A.5.31', clause: 'A.5.31', title: 'Juristische, gesetzliche, regulatorische und vertragliche Anforderungen', isoText: 'Ermitteln, Dokumentieren und Aktualisieren relevanter Anforderungen und der Vorgehensweise zur Einhaltung.', description: 'Compliance-Anforderungen.', purpose: 'Alle rechtlichen Anforderungen kennen.', questions: ['Welche Gesetze/Vorschriften gelten für Sie?', 'Wie stellen Sie Compliance sicher?'], correctiveAction: 'Erstellen Sie ein Compliance-Register.' },
      { id: 'A.5.32', clause: 'A.5.32', title: 'Geistige Eigentumsrechte', isoText: 'Einführen geeigneter Verfahren zum Schutz der Rechte an geistigem Eigentum.', description: 'IP-Schutz.', purpose: 'Geistiges Eigentum schützen.', questions: ['Wie schützen Sie IP?', 'Werden Lizenzen verwaltet?'], correctiveAction: 'Etablieren Sie IP- und Lizenzmanagement.' },
      { id: 'A.5.33', clause: 'A.5.33', title: 'Schutz von Aufzeichnungen', isoText: 'Schutz von Aufzeichnungen vor Verlust, Zerstörung, Fälschung, unbefugtem Zugriff und Veröffentlichung.', description: 'Records Management.', purpose: 'Aufzeichnungen schützen und aufbewahren.', questions: ['Wie werden Aufzeichnungen geschützt?', 'Gibt es Aufbewahrungsfristen?'], correctiveAction: 'Implementieren Sie Records Management.' },
      { id: 'A.5.34', clause: 'A.5.34', title: 'Datenschutz und Schutz von personenbezogenen Daten', isoText: 'Ermitteln und Erfüllen der Anforderungen an den Datenschutz und Schutz von PbD.', description: 'Datenschutz und DSGVO.', purpose: 'Personenbezogene Daten schützen.', questions: ['Wie setzen Sie DSGVO um?', 'Gibt es einen DSB?'], correctiveAction: 'Implementieren Sie Datenschutzmaßnahmen gemäß DSGVO.' },
      { id: 'A.5.35', clause: 'A.5.35', title: 'Unabhängige Überprüfung der IS', isoText: 'Unabhängige Überprüfung der Vorgehensweise und Umsetzung der IS in planmäßigen Abständen.', description: 'Externe Audits.', purpose: 'Unabhängige Bewertung der IS.', questions: ['Werden externe Audits durchgeführt?', 'Wie oft?'], correctiveAction: 'Planen Sie regelmäßige externe Audits.' },
      { id: 'A.5.36', clause: 'A.5.36', title: 'Einhaltung von Richtlinien, Vorschriften und Normen für die IS', isoText: 'Regelmäßige Überprüfung der Einhaltung von IS-Richtlinien, Regeln und Normen.', description: 'Compliance-Überprüfung.', purpose: 'Regelmäßig Einhaltung prüfen.', questions: ['Wie überprüfen Sie die Einhaltung von IS-Richtlinien?', 'Gibt es Self-Assessments?'], correctiveAction: 'Führen Sie regelmäßige Compliance-Checks durch.' },
      { id: 'A.5.37', clause: 'A.5.37', title: 'Dokumentierte Betriebsabläufe', isoText: 'Dokumentation der Betriebsverfahren für Informationsverarbeitungsanlagen und Bereitstellung für Personal.', description: 'SOPs für IT-Betrieb.', purpose: 'Betriebsabläufe dokumentieren.', questions: ['Sind Betriebsverfahren dokumentiert?', 'Sind SOPs aktuell?'], correctiveAction: 'Erstellen und pflegen Sie Betriebsdokumentation.' }
    ]
  },
  // A.6 Personenbezogene Maßnahmen (8 Kontrollen)
  {
    id: 'A.6',
    title: 'A.6 Personenbezogene Maßnahmen',
    controls: [
      { id: 'A.6.1', clause: 'A.6.1', title: 'Sicherheitsüberprüfung', isoText: 'Sicherheitsüberprüfung aller Personen vor Eintritt und fortlaufend, unter Berücksichtigung der Risiken.', description: 'Pre-Employment-Screening.', purpose: 'Mitarbeiter vor Einstellung prüfen.', questions: ['Welche Überprüfungen führen Sie durch?', 'Gibt es erweiterte Prüfungen für sensible Positionen?'], correctiveAction: 'Definieren Sie einen Screening-Prozess.' },
      { id: 'A.6.2', clause: 'A.6.2', title: 'Beschäftigungs- und Vertragsbedingungen', isoText: 'Festlegen der IS-Verantwortlichkeiten des Personals und der Organisation in den Vereinbarungen.', description: 'IS-Klauseln in Verträgen.', purpose: 'Sicherheitspflichten vertraglich regeln.', questions: ['Enthalten Verträge IS-Klauseln?', 'Gibt es NDAs?'], correctiveAction: 'Ergänzen Sie Verträge um IS-Klauseln.' },
      { id: 'A.6.3', clause: 'A.6.3', title: 'IS-Bewusstsein, -ausbildung und -schulung', isoText: 'Angemessenes Bewusstsein, Ausbildung, Schulung und regelmäßige Aktualisierungen für das Personal.', description: 'Security-Awareness-Programm.', purpose: 'Mitarbeiter sensibilisieren.', questions: ['Wie oft finden Schulungen statt?', 'Werden Phishing-Tests durchgeführt?'], correctiveAction: 'Etablieren Sie ein Awareness-Programm.' },
      { id: 'A.6.4', clause: 'A.6.4', title: 'Maßregelungsprozess', isoText: 'Formalisieren und Kommunizieren eines Maßregelungsprozesses bei Verstoß gegen die IS-Politik.', description: 'Disziplinarverfahren bei IS-Verstößen.', purpose: 'Verstöße haben Konsequenzen.', questions: ['Gibt es ein Disziplinarverfahren?', 'Ist es den Mitarbeitern bekannt?'], correctiveAction: 'Dokumentieren Sie ein Disziplinarverfahren.' },
      { id: 'A.6.5', clause: 'A.6.5', title: 'Verantwortlichkeiten bei Beendigung oder Änderung der Beschäftigung', isoText: 'Festlegen und Durchsetzen von IS-Verantwortlichkeiten, die nach Beendigung oder Änderung bestehen bleiben.', description: 'Offboarding-Prozess.', purpose: 'Sicheres Ausscheiden von Mitarbeitern.', questions: ['Wie schnell werden Zugänge gesperrt?', 'Werden Assets zurückgefordert?'], correctiveAction: 'Implementieren Sie einen Offboarding-Prozess.' },
      { id: 'A.6.6', clause: 'A.6.6', title: 'Vertraulichkeits- oder Geheimhaltungsvereinbarungen', isoText: 'Identifizieren, Dokumentieren, Überprüfen und Unterzeichnen von Vertraulichkeitsvereinbarungen durch das Personal.', description: 'NDAs und Geheimhaltung.', purpose: 'Vertraulichkeit vertraglich sichern.', questions: ['Unterschreiben alle Mitarbeiter NDAs?', 'Werden diese regelmäßig überprüft?'], correctiveAction: 'Etablieren Sie NDAs für alle Mitarbeiter.' },
      { id: 'A.6.7', clause: 'A.6.7', title: 'Remote-Arbeit', isoText: 'Ergreifen von Sicherheitsmaßnahmen zum Schutz von Informationen bei Remote-Arbeit.', description: 'Sicherheit im Homeoffice.', purpose: 'Remote-Arbeit absichern.', questions: ['Gibt es eine Remote-Work-Richtlinie?', 'Welche technischen Maßnahmen gelten?'], correctiveAction: 'Erstellen Sie eine Remote-Work-Richtlinie.' },
      { id: 'A.6.8', clause: 'A.6.8', title: 'Meldung von IS-Ereignissen', isoText: 'Bereitstellen eines Mechanismus zur rechtzeitigen Meldung beobachteter oder vermuteter IS-Ereignisse.', description: 'Meldesystem für Vorfälle.', purpose: 'Vorfälle schnell melden können.', questions: ['Wie können Mitarbeiter Vorfälle melden?', 'Ist der Prozess allen bekannt?'], correctiveAction: 'Etablieren Sie ein Incident-Meldesystem.' }
    ]
  },
  // A.7 Physische Maßnahmen (14 Kontrollen)
  {
    id: 'A.7',
    title: 'A.7 Physische Maßnahmen',
    controls: [
      { id: 'A.7.1', clause: 'A.7.1', title: 'Physische Sicherheitsperimeter', isoText: 'Festlegen und Verwenden von Sicherheitsperimetern zum Schutz von Bereichen mit Werten.', description: 'Sicherheitszonen definieren.', purpose: 'Sensible Bereiche abgrenzen.', questions: ['Welche Sicherheitszonen gibt es?', 'Wie sind diese gesichert?'], correctiveAction: 'Definieren Sie physische Sicherheitszonen.' },
      { id: 'A.7.2', clause: 'A.7.2', title: 'Physischer Zutritt', isoText: 'Schutz von Sicherheitsbereichen durch angemessene Zutrittssteuerung und Zutrittsstellen.', description: 'Zutrittskontrolle.', purpose: 'Zugang kontrollieren und protokollieren.', questions: ['Wie werden Zutritte kontrolliert?', 'Gibt es elektronische Systeme?'], correctiveAction: 'Implementieren Sie elektronische Zutrittskontrollen.' },
      { id: 'A.7.3', clause: 'A.7.3', title: 'Sichern von Büros, Räumen und Einrichtungen', isoText: 'Konzipieren und Umsetzen der physischen Sicherheit von Räumlichkeiten.', description: 'Bürosicherheit.', purpose: 'Auch normale Büros schützen.', questions: ['Gibt es Clean-Desk-Policies?', 'Werden Türen verschlossen?'], correctiveAction: 'Etablieren Sie Bürosicherheitsrichtlinien.' },
      { id: 'A.7.4', clause: 'A.7.4', title: 'Physische Sicherheitsüberwachung', isoText: 'Ständige Überwachung der Räumlichkeiten auf unbefugten physischen Zugang.', description: 'Videoüberwachung und Monitoring.', purpose: 'Unbefugten Zutritt erkennen.', questions: ['Gibt es Videoüberwachung?', 'Werden Aufnahmen ausgewertet?'], correctiveAction: 'Implementieren Sie Überwachungssysteme.' },
      { id: 'A.7.5', clause: 'A.7.5', title: 'Schutz vor physischen und umweltbedingten Bedrohungen', isoText: 'Planen und Umsetzen des Schutzes vor Naturkatastrophen und anderen physischen Bedrohungen.', description: 'Schutz vor Feuer, Wasser, etc.', purpose: 'Vor Naturgefahren schützen.', questions: ['Gibt es Brandschutzmaßnahmen?', 'Wie ist der Wasserschutz?'], correctiveAction: 'Implementieren Sie Schutz vor Umweltgefahren.' },
      { id: 'A.7.6', clause: 'A.7.6', title: 'Arbeiten in Sicherheitsbereichen', isoText: 'Konzipieren und Umsetzen von Sicherheitsmaßnahmen für die Arbeit in Sicherheitsbereichen.', description: 'Regeln für sensible Bereiche.', purpose: 'Verhaltensregeln in Sicherheitszonen.', questions: ['Gibt es spezielle Regeln für RZ-Bereiche?', 'Werden Besucher begleitet?'], correctiveAction: 'Definieren Sie Regeln für Sicherheitsbereiche.' },
      { id: 'A.7.7', clause: 'A.7.7', title: 'Aufgeräumte Arbeitsumgebung und Bildschirmsperren', isoText: 'Festlegen und Durchsetzen von Regeln für eine aufgeräumte Arbeitsumgebung und Bildschirmsperren.', description: 'Clean-Desk und Screen-Lock.', purpose: 'Informationen vor Blicken schützen.', questions: ['Gibt es Clean-Desk-Policy?', 'Sperren sich Bildschirme automatisch?'], correctiveAction: 'Implementieren Sie Clean-Desk und Screen-Lock-Policies.' },
      { id: 'A.7.8', clause: 'A.7.8', title: 'Platzierung und Schutz von Geräten und Betriebsmitteln', isoText: 'Sichere und geschützte Aufstellung von Geräten und Betriebsmitteln.', description: 'Sichere Geräteaufstellung.', purpose: 'Geräte vor Zugriff und Umwelt schützen.', questions: ['Wie sind Server aufgestellt?', 'Gibt es Klimatisierung?'], correctiveAction: 'Stellen Sie Geräte sicher auf.' },
      { id: 'A.7.9', clause: 'A.7.9', title: 'Sicherheit von Werten außerhalb der Räumlichkeiten', isoText: 'Schutz von Werten, die sich außerhalb des Standorts befinden.', description: 'Mobile Assets schützen.', purpose: 'Auch außerhalb der Firma schützen.', questions: ['Wie werden Laptops unterwegs geschützt?', 'Gibt es Transportrichtlinien?'], correctiveAction: 'Definieren Sie Richtlinien für mobile Assets.' },
      { id: 'A.7.10', clause: 'A.7.10', title: 'Speichermedien', isoText: 'Verwaltung von Speichermedien während ihres gesamten Lebenszyklus gemäß Klassifizierung.', description: 'Medienmanagement.', purpose: 'Speichermedien sicher handhaben.', questions: ['Wie werden USB-Sticks verwaltet?', 'Gibt es Verschlüsselung?'], correctiveAction: 'Implementieren Sie Medienmanagement.' },
      { id: 'A.7.11', clause: 'A.7.11', title: 'Versorgungseinrichtungen', isoText: 'Schutz von Informationsverarbeitungseinrichtungen vor Störungen durch Ausfälle von Versorgungseinrichtungen.', description: 'USV und Notstrom.', purpose: 'Stromausfälle überbrücken.', questions: ['Gibt es USV-Anlagen?', 'Wie lange können Sie überbrücken?'], correctiveAction: 'Implementieren Sie USV und Notstromversorgung.' },
      { id: 'A.7.12', clause: 'A.7.12', title: 'Sicherheit der Verkabelung', isoText: 'Schutz von Kabeln, die Strom, Daten oder unterstützende Dienste transportieren, vor Abhören, Störung oder Beschädigung.', description: 'Kabelsicherheit.', purpose: 'Kabel vor Manipulation schützen.', questions: ['Sind Kabel geschützt verlegt?', 'Gibt es Redundanzen?'], correctiveAction: 'Sichern Sie die Verkabelung.' },
      { id: 'A.7.13', clause: 'A.7.13', title: 'Instandhaltung von Geräten und Betriebsmitteln', isoText: 'Ordnungsgemäße Wartung von Geräten und Betriebsmitteln.', description: 'Wartung und Instandhaltung.', purpose: 'Geräte funktionsfähig halten.', questions: ['Gibt es Wartungspläne?', 'Wer führt Wartung durch?'], correctiveAction: 'Etablieren Sie Wartungsverfahren.' },
      { id: 'A.7.14', clause: 'A.7.14', title: 'Sichere Entsorgung oder Wiederverwendung von Geräten', isoText: 'Überprüfen von Geräten mit Speichermedien auf Entfernung oder Überschreibung sensibler Daten vor Entsorgung/Wiederverwendung.', description: 'Sichere Datenvernichtung.', purpose: 'Daten vor Entsorgung löschen.', questions: ['Wie werden Daten vernichtet?', 'Gibt es Vernichtungsprotokolle?'], correctiveAction: 'Implementieren Sie sichere Datenvernichtung.' }
    ]
  },
  // A.8 Technologische Maßnahmen (34 Kontrollen)
  {
    id: 'A.8',
    title: 'A.8 Technologische Maßnahmen',
    controls: [
      { id: 'A.8.1', clause: 'A.8.1', title: 'Endpunktgeräte des Benutzers', isoText: 'Schutz von Informationen, die auf Endpunktgeräten gespeichert, verarbeitet oder zugänglich sind.', description: 'Endpoint Security.', purpose: 'Laptops und mobile Geräte schützen.', questions: ['Sind Geräte verschlüsselt?', 'Gibt es MDM?'], correctiveAction: 'Implementieren Sie Endpoint-Schutz.' },
      { id: 'A.8.2', clause: 'A.8.2', title: 'Privilegierte Zugangsrechte', isoText: 'Einschränken und Verwalten der Zuteilung und des Gebrauchs von privilegierten Zugangsrechten.', description: 'Admin-Rechte-Management.', purpose: 'Admin-Rechte streng kontrollieren.', questions: ['Wie werden Admin-Rechte vergeben?', 'Gibt es PAM?'], correctiveAction: 'Implementieren Sie Privileged Access Management.' },
      { id: 'A.8.3', clause: 'A.8.3', title: 'Informationszugangsbeschränkung', isoText: 'Einschränken des Zugangs zu Informationen und Werten gemäß der Richtlinie zur Zugangssteuerung.', description: 'Need-to-know-Prinzip.', purpose: 'Nur benötigte Zugänge gewähren.', questions: ['Wie setzen Sie Need-to-know um?', 'Gibt es RBAC?'], correctiveAction: 'Implementieren Sie rollenbasierte Zugriffskontrolle.' },
      { id: 'A.8.4', clause: 'A.8.4', title: 'Zugriff auf den Quellcode', isoText: 'Angemessenes Verwalten des Lese- und Schreibzugriffs auf Quellcode, Entwicklungswerkzeuge und Bibliotheken.', description: 'Source-Code-Schutz.', purpose: 'Quellcode schützen.', questions: ['Wie wird Quellcode geschützt?', 'Gibt es Zugriffskontrollen?'], correctiveAction: 'Sichern Sie den Zugriff auf Quellcode.' },
      { id: 'A.8.5', clause: 'A.8.5', title: 'Sichere Authentisierung', isoText: 'Implementieren sicherer Authentisierungstechnologien und -verfahren.', description: 'Starke Authentifizierung.', purpose: 'MFA und sichere Anmeldung.', questions: ['Ist MFA implementiert?', 'Welche Passwort-Richtlinien gelten?'], correctiveAction: 'Implementieren Sie MFA für kritische Systeme.' },
      { id: 'A.8.6', clause: 'A.8.6', title: 'Kapazitätssteuerung', isoText: 'Überwachen der Ressourcennutzung und Anpassen an aktuelle und erwartete Kapazitätsanforderungen.', description: 'Capacity Management.', purpose: 'Ressourcen rechtzeitig skalieren.', questions: ['Wie überwachen Sie Kapazitäten?', 'Gibt es Schwellenwerte?'], correctiveAction: 'Etablieren Sie Kapazitätsüberwachung.' },
      { id: 'A.8.7', clause: 'A.8.7', title: 'Schutz gegen Schadsoftware', isoText: 'Umsetzung des Schutzes gegen Schadsoftware und Unterstützung durch Sensibilisierung.', description: 'Anti-Malware und EDR.', purpose: 'Vor Malware schützen.', questions: ['Welche Anti-Malware nutzen Sie?', 'Gibt es EDR?'], correctiveAction: 'Implementieren Sie umfassenden Malware-Schutz.' },
      { id: 'A.8.8', clause: 'A.8.8', title: 'Handhabung von technischen Schwachstellen', isoText: 'Einholen von Informationen, Bewerten der Gefährdung und Ergreifen angemessener Maßnahmen gegen Schwachstellen.', description: 'Vulnerability Management.', purpose: 'Schwachstellen zeitnah beheben.', questions: ['Wie erfahren Sie von Schwachstellen?', 'Wie schnell patchen Sie?'], correctiveAction: 'Etablieren Sie Vulnerability Management.' },
      { id: 'A.8.9', clause: 'A.8.9', title: 'Konfigurationsmanagement', isoText: 'Festlegen, Dokumentieren, Umsetzen, Überwachen und Überprüfen von Konfigurationen.', description: 'Sichere Konfigurationen.', purpose: 'Systeme sicher konfigurieren.', questions: ['Gibt es Baseline-Konfigurationen?', 'Werden Änderungen überwacht?'], correctiveAction: 'Implementieren Sie Configuration Management.' },
      { id: 'A.8.10', clause: 'A.8.10', title: 'Löschung von Informationen', isoText: 'Löschen nicht mehr benötigter Informationen aus Informationssystemen, Geräten oder Speichermedien.', description: 'Sichere Datenlöschung.', purpose: 'Daten vollständig löschen.', questions: ['Wie werden Daten gelöscht?', 'Gibt es Löschkonzepte?'], correctiveAction: 'Implementieren Sie sichere Löschverfahren.' },
      { id: 'A.8.11', clause: 'A.8.11', title: 'Datenmaskierung', isoText: 'Einsatz von Datenmaskierung gemäß Zugangssteuerungsrichtlinien und geschäftlichen Anforderungen.', description: 'Daten anonymisieren/pseudonymisieren.', purpose: 'Sensible Daten maskieren.', questions: ['Wird Datenmaskierung eingesetzt?', 'In welchen Bereichen?'], correctiveAction: 'Implementieren Sie Datenmaskierung.' },
      { id: 'A.8.12', clause: 'A.8.12', title: 'Verhinderung von Datenlecks', isoText: 'Anwendung von Maßnahmen zur Verhinderung von Datenlecks auf Systeme, Netzwerke und Geräte.', description: 'Data Loss Prevention.', purpose: 'Datenabfluss verhindern.', questions: ['Haben Sie DLP-Lösungen?', 'Welche Daten werden überwacht?'], correctiveAction: 'Implementieren Sie DLP-Maßnahmen.' },
      { id: 'A.8.13', clause: 'A.8.13', title: 'Sicherung von Informationen', isoText: 'Aufbewahren und regelmäßiges Prüfen von Sicherungskopien.', description: 'Backup und Recovery.', purpose: 'Daten sichern und wiederherstellen.', questions: ['Wie oft werden Backups erstellt?', 'Werden Restores getestet?'], correctiveAction: 'Etablieren Sie ein Backup-Konzept.' },
      { id: 'A.8.14', clause: 'A.8.14', title: 'Redundanz von informationsverarbeitenden Einrichtungen', isoText: 'Realisieren ausreichender Redundanz zur Einhaltung der Verfügbarkeitsanforderungen.', description: 'Hochverfügbarkeit.', purpose: 'Ausfallsicherheit gewährleisten.', questions: ['Welche Redundanzen gibt es?', 'Gibt es Failover?'], correctiveAction: 'Implementieren Sie Redundanz für kritische Systeme.' },
      { id: 'A.8.15', clause: 'A.8.15', title: 'Protokollierung', isoText: 'Erstellen, Speichern, Schützen und Analysieren von Protokollen relevanter Aktivitäten und Ereignisse.', description: 'Logging und Audit-Trails.', purpose: 'Aktivitäten nachvollziehbar machen.', questions: ['Was wird protokolliert?', 'Wie lange werden Logs aufbewahrt?'], correctiveAction: 'Etablieren Sie umfassendes Logging.' },
      { id: 'A.8.16', clause: 'A.8.16', title: 'Überwachung von Aktivitäten', isoText: 'Überwachen von Netzwerken, Systemen und Anwendungen auf anormales Verhalten.', description: 'Security Monitoring.', purpose: 'Anomalien erkennen.', questions: ['Gibt es SIEM?', 'Wie werden Anomalien erkannt?'], correctiveAction: 'Implementieren Sie Security Monitoring.' },
      { id: 'A.8.17', clause: 'A.8.17', title: 'Uhrensynchronisation', isoText: 'Synchronisation der Uhren von Informationsverarbeitungssystemen mit zugelassenen Zeitquellen.', description: 'NTP-Synchronisation.', purpose: 'Konsistente Zeitstempel.', questions: ['Sind Uhren synchronisiert?', 'Welche Zeitquelle wird genutzt?'], correctiveAction: 'Implementieren Sie NTP-Synchronisation.' },
      { id: 'A.8.18', clause: 'A.8.18', title: 'Gebrauch von Hilfsprogrammen mit privilegierten Rechten', isoText: 'Einschränken und strenges Überwachen des Gebrauchs solcher Hilfsprogramme.', description: 'Privilegierte Tools kontrollieren.', purpose: 'Admin-Tools überwachen.', questions: ['Welche privilegierten Tools werden genutzt?', 'Wie wird der Einsatz überwacht?'], correctiveAction: 'Kontrollieren Sie privilegierte Hilfsprogramme.' },
      { id: 'A.8.19', clause: 'A.8.19', title: 'Installation von Software auf Systemen im Betrieb', isoText: 'Umsetzen von Verfahren und Maßnahmen zur sicheren Verwaltung der Softwareinstallation auf in Betrieb befindlichen Systemen.', description: 'Software-Installation kontrollieren.', purpose: 'Nur autorisierte Software.', questions: ['Wer darf Software installieren?', 'Gibt es Whitelisting?'], correctiveAction: 'Kontrollieren Sie Software-Installationen.' },
      { id: 'A.8.20', clause: 'A.8.20', title: 'Netzwerksicherheit', isoText: 'Sichern, Verwalten und Kontrollieren von Netzwerken und Netzwerkgeräten.', description: 'Netzwerk absichern.', purpose: 'Netzwerk schützen.', questions: ['Wie ist das Netzwerk gesichert?', 'Gibt es Firewalls?'], correctiveAction: 'Implementieren Sie Netzwerksicherheit.' },
      { id: 'A.8.21', clause: 'A.8.21', title: 'Sicherheit von Netzwerkdiensten', isoText: 'Ermitteln, Umsetzen und Überwachen von Sicherheitsmechanismen, Dienstgüte und Dienstanforderungen für Netzwerkdienste.', description: 'Netzwerkdienste absichern.', purpose: 'Dienste sicher bereitstellen.', questions: ['Wie sind Netzwerkdienste gesichert?', 'Gibt es SLAs?'], correctiveAction: 'Sichern Sie Netzwerkdienste.' },
      { id: 'A.8.22', clause: 'A.8.22', title: 'Trennung von Netzwerken', isoText: 'Gruppieren und Trennen von Informationsdiensten, Benutzern und Informationssystemen in Netzwerken.', description: 'Netzwerksegmentierung.', purpose: 'Netzwerke trennen.', questions: ['Gibt es Netzwerksegmentierung?', 'Wie sind Zonen getrennt?'], correctiveAction: 'Implementieren Sie Netzwerksegmentierung.' },
      { id: 'A.8.23', clause: 'A.8.23', title: 'Webfilterung', isoText: 'Verwalten des Zugangs zu externen Websites zur Verringerung der Gefährdung durch bösartige Inhalte.', description: 'Web-Proxy und Filter.', purpose: 'Gefährliche Websites blockieren.', questions: ['Gibt es Webfilter?', 'Welche Kategorien werden blockiert?'], correctiveAction: 'Implementieren Sie Webfilterung.' },
      { id: 'A.8.24', clause: 'A.8.24', title: 'Verwendung von Kryptographie', isoText: 'Festlegen und Umsetzen von Regeln für den wirksamen Einsatz von Kryptographie, einschließlich Schlüsselverwaltung.', description: 'Verschlüsselung und Key-Management.', purpose: 'Daten verschlüsseln.', questions: ['Wo wird Verschlüsselung eingesetzt?', 'Wie werden Schlüssel verwaltet?'], correctiveAction: 'Implementieren Sie Kryptographie-Richtlinien.' },
      { id: 'A.8.25', clause: 'A.8.25', title: 'Lebenszyklus einer sicheren Entwicklung', isoText: 'Festlegen und Anwenden von Regeln für die sichere Entwicklung von Software und Systemen.', description: 'Secure SDLC.', purpose: 'Sicherheit in Entwicklung einbauen.', questions: ['Haben Sie einen Secure SDLC?', 'Gibt es Security-Reviews?'], correctiveAction: 'Implementieren Sie Secure Development Lifecycle.' },
      { id: 'A.8.26', clause: 'A.8.26', title: 'Anforderungen an die Anwendungssicherheit', isoText: 'Ermitteln, Spezifizieren und Genehmigen von IS-Anforderungen bei der Entwicklung oder Beschaffung von Anwendungen.', description: 'Security Requirements.', purpose: 'Sicherheitsanforderungen definieren.', questions: ['Wie werden Security Requirements erfasst?', 'Werden diese getestet?'], correctiveAction: 'Definieren Sie Security Requirements.' },
      { id: 'A.8.27', clause: 'A.8.27', title: 'Sichere Systemarchitektur und Entwicklungsgrundsätze', isoText: 'Festlegen, Dokumentieren und Anwenden von Grundsätzen für die Entwicklung sicherer Systeme.', description: 'Security Architecture.', purpose: 'Sicher designen.', questions: ['Gibt es Architektur-Richtlinien?', 'Werden Threat Models erstellt?'], correctiveAction: 'Etablieren Sie sichere Architektur-Prinzipien.' },
      { id: 'A.8.28', clause: 'A.8.28', title: 'Sichere Codierung', isoText: 'Anwendung der Grundsätze der sicheren Codierung bei der Softwareentwicklung.', description: 'Secure Coding.', purpose: 'Sicher programmieren.', questions: ['Gibt es Coding Guidelines?', 'Werden Code-Reviews durchgeführt?'], correctiveAction: 'Etablieren Sie Secure Coding Guidelines.' },
      { id: 'A.8.29', clause: 'A.8.29', title: 'Sicherheitsprüfung bei Entwicklung und Abnahme', isoText: 'Definieren und Integrieren von Sicherheitsprüfverfahren in den Entwicklungslebenszyklus.', description: 'Security Testing.', purpose: 'Sicherheit testen.', questions: ['Werden Penetrationstests durchgeführt?', 'Gibt es SAST/DAST?'], correctiveAction: 'Integrieren Sie Security Testing in den SDLC.' },
      { id: 'A.8.30', clause: 'A.8.30', title: 'Ausgegliederte Entwicklung', isoText: 'Leiten, Überwachen und Überprüfen der Aktivitäten bei der ausgegliederten Systementwicklung.', description: 'Externe Entwicklung überwachen.', purpose: 'Outsourcing sicher gestalten.', questions: ['Wie werden externe Entwickler überwacht?', 'Gibt es Security-Anforderungen?'], correctiveAction: 'Definieren Sie Anforderungen für externe Entwicklung.' },
      { id: 'A.8.31', clause: 'A.8.31', title: 'Trennung von Entwicklungs-, Test- und Produktionsumgebungen', isoText: 'Trennen und Sichern der verschiedenen Umgebungen.', description: 'Umgebungstrennung.', purpose: 'DEV, TEST, PROD trennen.', questions: ['Sind Umgebungen getrennt?', 'Wie wird der Zugriff kontrolliert?'], correctiveAction: 'Trennen Sie Entwicklungsumgebungen.' },
      { id: 'A.8.32', clause: 'A.8.32', title: 'Änderungssteuerung', isoText: 'Unterziehen von Änderungen an Informationsverarbeitungseinrichtungen und -systemen Änderungsmanagementverfahren.', description: 'Change Management.', purpose: 'Änderungen kontrollieren.', questions: ['Gibt es Change Management?', 'Wie werden Änderungen genehmigt?'], correctiveAction: 'Etablieren Sie Change Management.' },
      { id: 'A.8.33', clause: 'A.8.33', title: 'Testdaten', isoText: 'Geeignetes Auswählen, Schützen und Verwalten der Testdaten.', description: 'Testdaten-Management.', purpose: 'Testdaten schützen.', questions: ['Wie werden Testdaten erstellt?', 'Werden Produktionsdaten maskiert?'], correctiveAction: 'Implementieren Sie Testdaten-Management.' },
      { id: 'A.8.34', clause: 'A.8.34', title: 'Schutz der Informationssysteme während Tests im Rahmen von Audits', isoText: 'Planen und Vereinbaren von Audittests, die eine Beurteilung der in Betrieb befindlichen Systeme beinhalten.', description: 'Audit-Tests sicher durchführen.', purpose: 'Produktivsysteme bei Audits schützen.', questions: ['Wie werden Audit-Tests geplant?', 'Werden Produktivsysteme geschützt?'], correctiveAction: 'Planen Sie Audit-Tests sorgfältig.' }
    ]
  }
];
