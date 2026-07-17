# Carnet Auto

A Progressive Web App for tracking vehicle maintenance, fuel consumption, and document expiry dates. Built with React, TypeScript, and Capacitor for Android.

## Features

- **Dashboard** — odometer tracking, maintenance status overview, document expiry alerts
- **Maintenance** — full list of maintenance items with urgency indicators (OK / Soon / Overdue)
- **Fuel** — log fill-ups, view consumption stats (L/100km), fuel history
- **Settings** — language switcher (FR/EN), vehicle info, data reset
- **Onboarding** — first-time setup wizard for vehicle model, fuel type, odometer, documents

## Tech Stack

- React 19 + TypeScript
- Vite 7 (build tool)
- Tailwind CSS 3 + shadcn/ui components
- Capacitor (Android native wrapper)
- Data stored in browser localStorage

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20+ | JS runtime and package manager |
| JDK | 21 | Android compilation |
| Android SDK | API 35 | Android build tools |

### Install prerequisites (Ubuntu)

```bash
# Node.js 20 (via nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
nvm install 20

# JDK 21
sudo apt install openjdk-21-jdk-headless

# Android SDK command-line tools
mkdir -p ~/Android/Sdk/cmdline-tools
cd ~/Android/Sdk/cmdline-tools
wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
unzip commandlinetools-linux-11076708_latest.zip
mv cmdline-tools latest

# Add to ~/.bashrc
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

# Install SDK packages and accept licenses
sdkmanager --licenses
sdkmanager "platforms;android-35" "build-tools;35.0.0" "platform-tools"
```

## Development

```bash
npm install
npm run dev
```

Opens on http://localhost:3000 with hot reload.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build locally |

## Build Android APK

```bash
# Build web assets and sync to Android project
npm run build
npx cap add android      # first time only
npx cap sync android

# Build the debug APK
cd android
./gradlew assembleDebug
```

The APK is output to:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Rebuild after changes

```bash
npm run build && npx cap sync android && cd android && ./gradlew assembleDebug
```

### Install on phone

Transfer the `.apk` file to your Android device (USB, email, etc.) and open it. Enable **"Install from unknown sources"** in Settings > Security if prompted.

## Project Structure

```
app/
├── capacitor.config.ts          Capacitor configuration
├── vite.config.ts               Vite build settings
├── tailwind.config.js           Tailwind CSS theme config
├── public/
│   ├── icon.svg                 App icon
│   └── manifest.webmanifest     PWA manifest
└── src/
    ├── main.tsx                 Entry point
    ├── App.tsx                  Root component (Onboarding or Main)
    ├── components/
    │   ├── ItemDialog.tsx       Edit dialog for maintenance items
    │   ├── ItemRow.tsx          Row component for maintenance items
    │   ├── itemShared.tsx       Shared icons, styles, status formatting
    │   └── ui/                  40+ shadcn/ui components
    ├── data/
    │   └── carProfiles.ts       Car maintenance interval definitions
    ├── hooks/
    │   └── use-mobile.ts        Mobile breakpoint detection
    ├── lib/
    │   ├── i18n.ts              Internationalization (FR/EN)
    │   ├── status.ts            Maintenance status computation
    │   ├── store.tsx            React Context state management
    │   └── utils.ts             Utility functions
    ├── pages/
    │   ├── Main.tsx             Main app with tab navigation
    │   └── Onboarding.tsx       First-time setup wizard
    ├── sections/
    │   ├── Dashboard.tsx        Dashboard view
    │   ├── Fuel.tsx             Fuel tracking view
    │   ├── Maintenance.tsx      Maintenance list view
    │   └── Settings.tsx         Settings view
    └── types/
        └── index.ts             TypeScript type definitions
```

## Supported Vehicles

- Toyota Yaris (1999+, timing chain)
- Peugeot 106 (1991-2003, timing belt)
