import { Framework } from '@/types/framework';

export const tisaxFramework: Framework = {
  id: 'tisax',
  name: 'TISAX (Trusted Information Security Assessment Exchange)',
  shortName: 'TISAX',
  description: 'Automotive Industry Information Security Standard',
  version: '6.0',
  groups: [
    {
      id: 'information-security',
      title: 'Informationssicherheit',
      sections: [
        {
          id: 'IS.1',
          title: 'IS.1 Informationssicherheitsrichtlinien',
          controls: [
            { id: 'IS.1.1', clause: 'IS.1.1', title: 'Richtlinien für Informationssicherheit', isoText: 'Die Organisation muss Informationssicherheitsrichtlinien definieren.', description: 'Dokumentierte IS-Richtlinien.', purpose: 'Klare Vorgaben für IS.', questions: ['Gibt es dokumentierte IS-Richtlinien?', 'Sind diese vom Management genehmigt?'], correctiveAction: 'Erstellen Sie IS-Richtlinien.' },
            { id: 'IS.1.2', clause: 'IS.1.2', title: 'Überprüfung der Richtlinien', isoText: 'Regelmäßige Überprüfung der IS-Richtlinien.', description: 'Periodische Review-Zyklen.', purpose: 'Aktualität sicherstellen.', questions: ['Wie oft werden Richtlinien überprüft?'], correctiveAction: 'Etablieren Sie Review-Zyklen.' }
          ]
        },
        {
          id: 'IS.2',
          title: 'IS.2 Organisation der Informationssicherheit',
          controls: [
            { id: 'IS.2.1', clause: 'IS.2.1', title: 'Rollen und Verantwortlichkeiten', isoText: 'Definition von IS-Rollen und Verantwortlichkeiten.', description: 'Klare Zuständigkeiten.', purpose: 'Verantwortlichkeiten festlegen.', questions: ['Sind IS-Rollen definiert?', 'Gibt es einen ISB?'], correctiveAction: 'Definieren Sie IS-Rollen.' },
            { id: 'IS.2.2', clause: 'IS.2.2', title: 'Aufgabentrennung', isoText: 'Trennung kritischer Aufgaben.', description: 'Vier-Augen-Prinzip.', purpose: 'Missbrauch verhindern.', questions: ['Ist Aufgabentrennung implementiert?'], correctiveAction: 'Implementieren Sie Aufgabentrennung.' },
            { id: 'IS.2.3', clause: 'IS.2.3', title: 'Kontakt mit Behörden', isoText: 'Kontaktpflege zu relevanten Behörden.', description: 'Behördenkontakte.', purpose: 'Schnelle Reaktion im Notfall.', questions: ['Gibt es eine Behördenkontaktliste?'], correctiveAction: 'Erstellen Sie eine Kontaktliste.' }
          ]
        },
        {
          id: 'IS.3',
          title: 'IS.3 Personalsicherheit',
          controls: [
            { id: 'IS.3.1', clause: 'IS.3.1', title: 'Sicherheitsüberprüfung', isoText: 'Überprüfung von Mitarbeitern vor Einstellung.', description: 'Background Checks.', purpose: 'Vertrauenswürdigkeit sicherstellen.', questions: ['Werden Background Checks durchgeführt?'], correctiveAction: 'Führen Sie Überprüfungen ein.' },
            { id: 'IS.3.2', clause: 'IS.3.2', title: 'Arbeitsvertragliche Regelungen', isoText: 'IS-Klauseln in Arbeitsverträgen.', description: 'Vertragliche IS-Pflichten.', purpose: 'Rechtliche Verbindlichkeit.', questions: ['Enthalten Verträge IS-Klauseln?'], correctiveAction: 'Ergänzen Sie Vertragsklauseln.' },
            { id: 'IS.3.3', clause: 'IS.3.3', title: 'Sensibilisierung und Schulung', isoText: 'Regelmäßige IS-Schulungen.', description: 'Awareness-Programme.', purpose: 'Mitarbeiter sensibilisieren.', questions: ['Gibt es regelmäßige Schulungen?'], correctiveAction: 'Etablieren Sie Schulungsprogramme.' }
          ]
        }
      ]
    },
    {
      id: 'prototype-protection',
      title: 'Prototypenschutz',
      sections: [
        {
          id: 'PP.1',
          title: 'PP.1 Physischer Schutz',
          controls: [
            { id: 'PP.1.1', clause: 'PP.1.1', title: 'Sicherheitszonen', isoText: 'Definition und Absicherung von Sicherheitszonen.', description: 'Physische Sicherheitsbereiche.', purpose: 'Unbefugten Zugang verhindern.', questions: ['Sind Sicherheitszonen definiert?', 'Wie werden sie überwacht?'], correctiveAction: 'Definieren Sie Sicherheitszonen.' },
            { id: 'PP.1.2', clause: 'PP.1.2', title: 'Zutrittskontrolle', isoText: 'Kontrolle des physischen Zutritts.', description: 'Zutrittskontrollsysteme.', purpose: 'Nur autorisierter Zutritt.', questions: ['Welche Zutrittskontrollsysteme sind im Einsatz?'], correctiveAction: 'Implementieren Sie Zutrittskontrolle.' },
            { id: 'PP.1.3', clause: 'PP.1.3', title: 'Fotografierverbot', isoText: 'Verbot von Aufnahmen in Schutzbereichen.', description: 'Kamera-/Handyverbot.', purpose: 'Informationsabfluss verhindern.', questions: ['Gibt es ein Fotografierverbot?'], correctiveAction: 'Erlassen Sie ein Fotografierverbot.' }
          ]
        },
        {
          id: 'PP.2',
          title: 'PP.2 Informationsschutz',
          controls: [
            { id: 'PP.2.1', clause: 'PP.2.1', title: 'Klassifizierung', isoText: 'Klassifizierung von Prototypen-Informationen.', description: 'Einstufung nach Schutzbedarf.', purpose: 'Angemessenen Schutz gewährleisten.', questions: ['Gibt es ein Klassifizierungsschema?'], correctiveAction: 'Etablieren Sie ein Klassifizierungsschema.' },
            { id: 'PP.2.2', clause: 'PP.2.2', title: 'Kennzeichnung', isoText: 'Kennzeichnung vertraulicher Informationen.', description: 'Sichtbare Markierungen.', purpose: 'Erkennbarkeit sicherstellen.', questions: ['Werden Dokumente gekennzeichnet?'], correctiveAction: 'Führen Sie Kennzeichnungen ein.' },
            { id: 'PP.2.3', clause: 'PP.2.3', title: 'Handhabung', isoText: 'Sichere Handhabung von Prototypen-Informationen.', description: 'Handling-Prozeduren.', purpose: 'Sichere Verarbeitung.', questions: ['Gibt es Handling-Prozeduren?'], correctiveAction: 'Definieren Sie Handling-Prozeduren.' }
          ]
        }
      ]
    },
    {
      id: 'data-protection',
      title: 'Datenschutz',
      sections: [
        {
          id: 'DP.1',
          title: 'DP.1 Datenschutz-Grundsätze',
          controls: [
            { id: 'DP.1.1', clause: 'DP.1.1', title: 'Datenschutzbeauftragter', isoText: 'Benennung eines Datenschutzbeauftragten.', description: 'DSB-Funktion.', purpose: 'Compliance sicherstellen.', questions: ['Ist ein DSB benannt?'], correctiveAction: 'Benennen Sie einen DSB.' },
            { id: 'DP.1.2', clause: 'DP.1.2', title: 'Verarbeitungsverzeichnis', isoText: 'Führung eines Verarbeitungsverzeichnisses.', description: 'Dokumentation der Verarbeitungen.', purpose: 'Transparenz und Nachweisbarkeit.', questions: ['Gibt es ein Verarbeitungsverzeichnis?'], correctiveAction: 'Erstellen Sie ein Verarbeitungsverzeichnis.' },
            { id: 'DP.1.3', clause: 'DP.1.3', title: 'Betroffenenrechte', isoText: 'Prozesse zur Erfüllung von Betroffenenrechten.', description: 'Auskunft, Löschung, etc.', purpose: 'DSGVO-Compliance.', questions: ['Wie werden Betroffenenanfragen bearbeitet?'], correctiveAction: 'Etablieren Sie Prozesse für Betroffenenrechte.' }
          ]
        }
      ]
    }
  ]
};
