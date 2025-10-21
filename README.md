# Unternehmens-Kommunikations-App

Eine moderne Web-Applikation für interne Unternehmenskommunikation mit News Feed und Echtzeit-Chat.

## Features

- **News Feed**: Mitarbeiter können Nachrichten veröffentlichen und Kommentare hinterlassen
- **Echtzeit-Chat**: Direktes Messaging zwischen Mitarbeitern mit Socket.io
- **Benutzer-Management**: Einfacher Benutzerwechsel für Demo-Zwecke
- **Moderne UI**: Responsive Design mit Tailwind CSS

## Technologie-Stack

### Frontend
- React 18 mit TypeScript
- Tailwind CSS für Styling
- Socket.io Client für Echtzeit-Kommunikation
- Vite als Build-Tool

### Backend
- Node.js mit Express
- Socket.io für WebSocket-Kommunikation
- SQLite Datenbank
- TypeScript

## Installation

1. **Dependencies installieren**:
   ```bash
   npm install
   ```

2. **Datenbank-Verzeichnis erstellen**:
   ```bash
   mkdir data
   ```

## Starten der Anwendung

1. **Development-Server starten** (Backend + Frontend gleichzeitig):
   ```bash
   npm run dev
   ```

   Dies startet:
   - Backend-Server auf `http://localhost:3001`
   - Frontend-Server auf `http://localhost:3000`

2. **Öffnen Sie im Browser**:
   ```
   http://localhost:3000
   ```

## Verwendung

### Benutzer wechseln
Verwenden Sie das Dropdown-Menü oben rechts, um zwischen verschiedenen Demo-Benutzern zu wechseln:
- Max Müller
- Anna Schmidt
- Tom Weber

### News Feed
1. Klicken Sie auf den Tab "News Feed"
2. Erstellen Sie eine neue Nachricht mit Titel und Inhalt
3. Klicken Sie "Veröffentlichen"
4. Andere Benutzer können die Nachricht sehen und kommentieren
5. Klicken Sie "Kommentare anzeigen" um Kommentare zu lesen oder zu schreiben

### Chat
1. Klicken Sie auf den Tab "Chat"
2. Schreiben Sie eine Nachricht im Eingabefeld
3. Klicken Sie "Senden" oder drücken Sie Enter
4. Nachrichten erscheinen sofort bei allen verbundenen Benutzern (Echtzeit)

## Projekt-Struktur

```
Patrick/
├── server/              # Backend-Code
│   ├── index.ts        # Express-Server und Socket.io
│   └── database.ts     # SQLite Datenbank-Setup
├── src/                # Frontend-Code
│   ├── components/     # React-Komponenten
│   │   ├── NewsFeed.tsx
│   │   └── Chat.tsx
│   ├── App.tsx         # Haupt-App-Komponente
│   ├── main.tsx        # React-Entry-Point
│   └── index.css       # Tailwind CSS
├── data/               # SQLite Datenbank (erstellt automatisch)
├── package.json        # Dependencies
├── vite.config.ts      # Vite-Konfiguration
├── tailwind.config.js  # Tailwind-Konfiguration
└── tsconfig.json       # TypeScript-Konfiguration
```

## Datenbank-Schema

### Tabellen
- **users**: Benutzerinformationen
- **news_posts**: News-Beiträge
- **comments**: Kommentare zu News-Beiträgen
- **chat_messages**: Chat-Nachrichten

## Erweiterungsmöglichkeiten

- Authentifizierung mit echtem Login-System
- Private Nachrichten zwischen einzelnen Benutzern
- Datei-Upload für News-Beiträge
- Benachrichtigungen
- Benutzer-Profile
- Suche und Filter-Funktionen
- Mobile App mit React Native

## Lizenz

MIT
