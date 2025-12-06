# Audit Companion

Ein professionelles Compliance-Audit-Management-Tool für ISO 27001, TISAX und NIS2 Audits.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18.3-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6)

---

## 📋 Inhaltsverzeichnis

- [Überblick](#-überblick)
- [Features](#-features)
- [Technologie-Stack](#-technologie-stack)
- [Installation](#-installation)
- [Projektstruktur](#-projektstruktur)
- [Verwendung](#-verwendung)
- [Datenbank-Schema](#-datenbank-schema)
- [Konfiguration](#-konfiguration)
- [Deployment](#-deployment)

---

## 🎯 Überblick

**Audit Companion** ist eine webbasierte Anwendung zur Durchführung und Verwaltung von Compliance-Audits. Die Anwendung unterstützt Auditoren bei der systematischen Prüfung von Organisationen nach internationalen Standards wie ISO 27001, TISAX und NIS2.

### Kernfunktionen

- **Multi-Framework-Unterstützung**: Führen Sie Audits nach ISO 27001, TISAX oder NIS2 durch – auch kombiniert
- **Echtzeit-Kollaboration**: Mehrere Auditoren können gleichzeitig an einem Audit arbeiten
- **Strukturierte Bewertung**: Jedes Control wird mit OK, OFI, Minor NC oder Major NC bewertet
- **Automatische Berechnung**: Zertifizierungsreife-Score wird in Echtzeit berechnet
- **Wissensmanagement**: Berater können Erfahrungen und Best Practices teilen
- **Export-Funktion**: Generieren Sie strukturierte Audit-Berichte

---

## ✨ Features

### 1. Dashboard

Das Dashboard bietet einen Überblick über alle Audits:

| Feature | Beschreibung |
|---------|-------------|
| **Audit-Liste** | Alle Audits mit Fortschrittsanzeige |
| **Schnellsuche** | Suche nach Kundennamen oder Framework |
| **Filter** | Filterung nach Framework (ISO 27001, TISAX, NIS2) |
| **Neues Audit** | Dialog zur Erstellung neuer Audits |
| **Benutzermenü** | Profiloptionen, Passwortänderung, Abmeldung |
| **Dark/Light Mode** | Umschaltbarer Anzeigemodus |

### 2. Audit-Ansicht

Die Hauptansicht für die Durchführung eines Audits:

#### Sidebar (Links)
- **Hierarchische Navigation**: Framework → Gruppe → Sektion → Control
- **Status-Indikatoren**: Farbige Icons zeigen den Bewertungsstatus jedes Controls
- **Fortschrittsanzeige**: Zeigt Anzahl der geprüften Controls
- **Einstellungen**: Ändern von Framework und Sprache

#### Control-Karte (Mitte)
- **Control-Header**: Clause-Nummer, Titel und Beschreibung
- **Info-Tabs**:
  - *Fragen*: Audit-Fragen zur Prüfung
  - *Normtext*: Originaler ISO/TISAX-Text
  - *Zweck*: Erklärung des Control-Ziels
  - *Maßnahme*: Empfohlene Korrekturmaßnahmen
- **Bewertungsbuttons**:
  - ⚪ **Offen** – Noch nicht bewertet
  - ✅ **Konform (OK)** – Anforderung erfüllt
  - 🔵 **OFI** – Opportunity for Improvement
  - 🟡 **Minor NC** – Kleine Nichtkonformität
  - 🔴 **Major NC** – Schwere Nichtkonformität
- **Dokumentation**:
  - Notizfeld für Beobachtungen
  - Nachweisfeld für Dokumentenreferenzen
  - Datei-Upload für Anhänge (max. 10MB)

#### Beraterwissen-Panel
- Geteilte Erfahrungen anderer Auditoren
- Kategorien: Best Practice, Typische Schwäche, Interview-Tipp, Dokument-Hinweis, Template-Referenz
- Hinzufügen eigener Einträge
- Nutzungsstatistik

#### Cockpit (Rechts)
- **Zertifizierungsreife-Score**: Automatische Berechnung basierend auf Bewertungen
- **Timer**: Zeitmessung für das Audit mit Durchschnittsberechnung
- **Audit-Info**: Erstellungsdatum, Ersteller
- **Team-Management**: Teammitglieder hinzufügen/entfernen
- **Aktivitätslog**: Chronologische Aufzeichnung aller Änderungen

### 3. Zertifizierungsreife-Berechnung

Der Readiness-Score wird nach folgender Logik berechnet:

```
Score = (OK × 100 + OFI × 85 + Minor × 50 + Major × 0) / Geprüfte Controls
```

| Status | Punkte | Beschreibung |
|--------|--------|--------------|
| OK | 100 | Vollständig konform |
| OFI | 85 | Konform mit Verbesserungspotential |
| Minor NC | 50 | Teilweise konform |
| Major NC | 0 | Nicht konform (Blocker) |

**Interpretationen:**
- ≥85%: **Bereit** zur Zertifizierung
- 70-84%: **Nachbesserung** erforderlich
- <70%: **Nicht bereit**

### 4. Echtzeit-Kollaboration

- **Presence-System**: Sehen Sie, welche Teammitglieder gerade aktiv sind
- **Feld-Indikatoren**: Anzeige, wenn ein anderer Benutzer ein Feld bearbeitet
- **Automatische Synchronisation**: Änderungen werden sofort für alle sichtbar
- **Aktivitätslog**: Alle Aktionen werden protokolliert

### 5. Export-Funktion

Generieren Sie einen strukturierten Audit-Bericht als Textdatei:

```
================================================
         AUDIT-BERICHT: [Kundenname]
================================================

ZUSAMMENFASSUNG
- Geprüfte Controls: X/Y
- Konform (OK): X
- OFI: X
- Minor NC: X
- Major NC: X
- Zertifizierungsreife: X%

DETAILLIERTE BEFUNDE
[Nach Framework und Sektion gruppiert]
```

### 6. Mehrsprachigkeit

Die Anwendung unterstützt:
- 🇩🇪 **Deutsch** (Standard)
- 🇬🇧 **Englisch**

Control-Texte (Fragen, Normtext, Zweck) werden in der gewählten Sprache angezeigt.

---

## 🛠 Technologie-Stack

### Frontend

| Technologie | Version | Verwendung |
|-------------|---------|------------|
| **React** | 18.3 | UI-Framework |
| **TypeScript** | 5.5 | Typsicherheit |
| **Vite** | 5.4 | Build-Tool |
| **Tailwind CSS** | 3.4 | Styling |
| **shadcn/ui** | - | UI-Komponenten |
| **React Router** | 6 | Navigation |
| **Lucide React** | - | Icons |
| **date-fns** | - | Datumsformatierung |

### Backend

| Technologie | Verwendung |
|-------------|------------|
| **Supabase** | PostgreSQL-Datenbank, Authentifizierung, Realtime |
| **Row Level Security** | Datenschutz auf Zeilenebene |
| **Realtime Subscriptions** | Live-Updates |

---

## 📦 Installation

### Voraussetzungen

- Node.js 18+ oder Bun
- npm, yarn, pnpm oder bun
- Supabase-Projekt

### 1. Repository klonen

```bash
git clone https://github.com/your-org/audit-companion.git
cd audit-companion
```

### 2. Abhängigkeiten installieren

```bash
npm install
# oder
bun install
```

### 3. Umgebungsvariablen konfigurieren

Erstellen Sie eine `.env`-Datei:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Datenbank-Migrationen ausführen

```bash
npx supabase db push
```

### 5. Entwicklungsserver starten

```bash
npm run dev
# oder
bun dev
```

Die Anwendung ist unter `http://localhost:8080` erreichbar.

---

## 📁 Projektstruktur

```
audit-companion/
├── src/
│   ├── components/
│   │   ├── audit/
│   │   │   ├── AuditCard.tsx          # Control-Bewertung
│   │   │   ├── AuditCockpit.tsx       # Seitenleiste rechts
│   │   │   ├── AuditPlanningDialog.tsx
│   │   │   ├── AuditSettingsDialog.tsx
│   │   │   ├── AuditTimer.tsx         # Zeitmessung
│   │   │   ├── CreateAuditDialog.tsx  # Neues Audit erstellen
│   │   │   ├── EvidenceUpload.tsx     # Datei-Upload
│   │   │   ├── FieldPresenceIndicator.tsx
│   │   │   ├── KnowledgePanel.tsx     # Beraterwissen
│   │   │   ├── ReadinessScore.tsx     # Zertifizierungsreife
│   │   │   └── Sidebar.tsx            # Navigation links
│   │   ├── ui/                        # shadcn/ui Komponenten
│   │   ├── ChangePasswordDialog.tsx
│   │   ├── NavLink.tsx
│   │   └── ThemeToggle.tsx
│   │
│   ├── data/
│   │   └── frameworks/
│   │       ├── index.ts               # Framework-Loader
│   │       ├── iso27001.ts            # ISO 27001 Controls
│   │       ├── tisax.ts               # TISAX Controls
│   │       └── nis2.ts                # NIS2 Controls
│   │
│   ├── hooks/
│   │   ├── useAudit.tsx               # Audit-Liste
│   │   ├── useAuditDetail.tsx         # Einzelnes Audit
│   │   ├── useAuditPlanning.tsx
│   │   ├── useAuditPresence.tsx       # Echtzeit-Präsenz
│   │   ├── useAuditTeam.tsx           # Team-Management
│   │   ├── useAuth.tsx                # Authentifizierung
│   │   ├── useConsultantKnowledge.tsx # Beraterwissen
│   │   ├── useLanguage.tsx            # Spracheinstellungen
│   │   ├── useReadinessScore.tsx      # Score-Berechnung
│   │   ├── useRealtimeFindings.tsx    # Live-Updates
│   │   └── useTimeTracking.tsx
│   │
│   ├── i18n/
│   │   └── translations.ts            # Übersetzungen
│   │
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts              # Supabase-Client
│   │       └── types.ts               # Datenbank-Typen
│   │
│   ├── pages/
│   │   ├── Auth.tsx                   # Login/Registrierung
│   │   ├── AuditView.tsx              # Audit-Hauptansicht
│   │   ├── Dashboard.tsx              # Übersicht
│   │   └── NotFound.tsx
│   │
│   ├── types/
│   │   ├── audit.ts                   # Audit-Typen
│   │   └── framework.ts               # Framework-Typen
│   │
│   ├── utils/
│   │   └── export.ts                  # Export-Funktionen
│   │
│   ├── App.tsx
│   ├── index.css                      # Globale Styles
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── supabase/
│   ├── config.toml
│   └── migrations/                    # Datenbank-Migrationen
│
├── public/
├── .env
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## 💻 Verwendung

### Neues Audit erstellen

1. Klicken Sie auf **"Neues Audit"** im Dashboard
2. Geben Sie den **Kundennamen** ein
3. Wählen Sie die **Sprache** (DE/EN)
4. Wählen Sie ein oder mehrere **Frameworks**
5. Klicken Sie auf **"Erstellen"**

### Audit durchführen

1. Öffnen Sie ein Audit aus dem Dashboard
2. Navigieren Sie über die Sidebar zum gewünschten Control
3. Lesen Sie die **Fragen** und **Normtext**
4. Wählen Sie den passenden **Status**:
   - **OK**: Alle Anforderungen erfüllt
   - **OFI**: Erfüllt, aber Verbesserungspotential
   - **Minor NC**: Teilweise erfüllt, keine kritischen Risiken
   - **Major NC**: Nicht erfüllt, Zertifizierung nicht möglich
5. Dokumentieren Sie Ihre Beobachtungen in den **Notizen**
6. Fügen Sie **Nachweise** und **Dateien** hinzu

### Team verwalten

1. Im **Cockpit** (rechts) unter "Team"
2. Klicken Sie auf das **+**-Icon
3. Wählen Sie einen Benutzer aus
4. Teammitglieder können das Audit bearbeiten

### Bericht exportieren

1. Klicken Sie auf **"Export"** in der Header-Leiste
2. Eine Textdatei mit allen Befunden wird heruntergeladen

---

## 🗄 Datenbank-Schema

### Haupttabellen

#### `audits`
```sql
id              UUID PRIMARY KEY
user_id         UUID REFERENCES auth.users
client_name     TEXT NOT NULL
language        TEXT DEFAULT 'de'
frameworks      TEXT[] DEFAULT ['iso27001']
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

#### `audit_findings`
```sql
id              UUID PRIMARY KEY
audit_id        UUID REFERENCES audits
control_id      TEXT NOT NULL
status          TEXT (UNCHECKED, OK, OFI, MINOR_NC, MAJOR_NC)
notes           TEXT
evidence        TEXT
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

#### `evidence_files`
```sql
id              UUID PRIMARY KEY
audit_id        UUID REFERENCES audits
control_id      TEXT NOT NULL
file_name       TEXT
file_path       TEXT
file_size       BIGINT
mime_type       TEXT
created_at      TIMESTAMP
```

#### `audit_team_members`
```sql
id              UUID PRIMARY KEY
audit_id        UUID REFERENCES audits
user_id         UUID REFERENCES auth.users
added_at        TIMESTAMP
```

#### `consultant_knowledge`
```sql
id              UUID PRIMARY KEY
control_id      TEXT NOT NULL
knowledge_type  TEXT
title           TEXT
content         TEXT
source          TEXT
created_by      UUID REFERENCES auth.users
usage_count     INTEGER
created_at      TIMESTAMP
```

#### `audit_activity_log`
```sql
id              UUID PRIMARY KEY
audit_id        UUID REFERENCES audits
user_id         UUID REFERENCES auth.users
event_type      TEXT
event_data      JSONB
created_at      TIMESTAMP
```

### Row Level Security

Alle Tabellen sind mit RLS geschützt:
- Benutzer sehen nur eigene Audits oder Audits, bei denen sie Teammitglied sind
- Schreibzugriff nur für Audit-Ersteller und Teammitglieder

---

## ⚙️ Konfiguration

### Supabase-Einrichtung

1. Erstellen Sie ein Projekt auf [supabase.com](https://supabase.com)
2. Führen Sie die Migrationen aus `/supabase/migrations` aus
3. Aktivieren Sie **Realtime** für die Tabellen:
   - `audit_findings`
   - `evidence_files`
   - `audit_team_members`
   - `audit_activity_log`

### Umgebungsvariablen

| Variable | Beschreibung |
|----------|--------------|
| `VITE_SUPABASE_URL` | Supabase-Projekt-URL |
| `VITE_SUPABASE_ANON_KEY` | Öffentlicher API-Schlüssel |

---

## 🚀 Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Deployen Sie den /dist Ordner
```

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE)

---

## 🤝 Beitragen

1. Fork erstellen
2. Feature-Branch: `git checkout -b feature/neue-funktion`
3. Änderungen committen: `git commit -m 'Neue Funktion hinzugefügt'`
4. Branch pushen: `git push origin feature/neue-funktion`
5. Pull Request erstellen

---

## 📞 Support

Bei Fragen oder Problemen:
- Issue erstellen auf GitHub
- E-Mail: support@audit-companion.de

---

**Made with ❤️ for Auditors**
