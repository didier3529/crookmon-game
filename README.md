# crookmon-game

A React single-page application delivering animated card duels with lazy-loaded assets, persistent win-streak tracking, deep-linking, social sharing, analytics, and non-intrusive monetization through interstitial ads and premium skins.

---

## Table of Contents

1. [Overview](#overview)  
2. [Features](#features)  
3. [Architecture & Flow](#architecture--flow)  
4. [Installation](#installation)  
5. [Usage](#usage)  
6. [Component Reference](#component-reference)  
7. [Dependencies](#dependencies)  
8. [Project Structure](#project-structure)  
9. [Contributing](#contributing)  
10. [License](#license)  

---

## Overview

**Crookmon Quick Clash** is a modular, TypeScript-ready React SPA. Players select squads of animated cards and watch turn-based duels play out with custom animations. The app tracks win streaks in `localStorage`, supports deep-linking to specific matchups, enables social sharing, logs structured analytics, and incorporates monetization via interstitial ads, affiliate banners, and purchasable premium skins. Accessibility (ARIA roles, keyboard nav) and runtime error handling (ErrorBoundary) are built in.

---

## Features

- React SPA with code-splitting (React.lazy & Suspense)  
- Persistent win-streak tracking (localStorage)  
- Deep-linking & shareable URLs  
- Animated duels (Framer Motion) via a custom duel-logic hook  
- Global settings: sound & theme (light/dark)  
- Interstitial ads, affiliate banners & premium skins for monetization  
- Accessibility compliance (ARIA roles, keyboard navigation)  
- ErrorBoundary for runtime errors + fallback UI  
- Structured analytics via `AnalyticsService`  
- Modular Context + hook-based architecture  
- Incremental TypeScript migration  

---

## Architecture & Flow

1. **Entry**: `index.js` mounts `app.jsx`.  
2. **Global Setup**: `app.tsx` (inside ErrorBoundary) initializes `AnalyticsService` and context providers (`SettingsContext`, `WinStreakContext`, `DuelContext`).  
3. **Home**: `Header` + `CardPickerGrid` (lazy-loaded `CardTile`s).  
4. **Duel Init**: On card selection, `useDuelLogic` and `DuelContext` prepare the `BattleScreen`.  
5. **Battle**: `BattleScreen` animates turns; `ResultsOverlay` shows outcome & updates win streak.  
6. **Monetization**: `useInterstitialAd` triggers `InterstitialAdManager`; `AffiliateLinkBanner` displays affiliate links; `PremiumSkinModal` offers skins.  
7. **Global UI**: `ShareLinkModal`, `SettingsModal`, `Footer`, and `LoadingSpinner` (Suspense fallback).  
8. **Error Handling**: `ErrorBoundary` catches uncaught errors, logs via `AnalyticsService`, and shows fallback UI.  

---

## Installation

```bash
git clone https://github.com/yourusername/crookmon-game.git
cd crookmon-game
npm install
# or
yarn install
```

---

## Usage

```bash
# Start development server
npm start
# or
yarn start

# Build for production
npm run build
# or
yarn build

# Run tests (if configured)
npm test
```

Open http://localhost:3000 in your browser.  

---

## Component Reference

### Context Providers

- **SettingsContext** (`settingscontext.tsx`)  
  Manages sound & theme preferences (persisted via `useLocalStorage`).

- **DuelContext** (`duelcontext.tsx`)  
  Holds current duel state (player/opponent decks, action sequence).

- **WinStreakContext** (`winstreakcontext.tsx`)  
  Tracks & persists user win-streak.

### Custom Hooks

- **useLocalStorage** (`uselocalstorage.ts`)  
  Syncs React state with `localStorage`.

- **useQueryParams** (`usequeryparams.ts`)  
  Parses & sets URL query parameters (deep-linking).

- **useDuelLogic** (`useduellogic.ts`)  
  Precomputes duel turns & outcome; exposes `startDuel`, `playTurn`, `resetDuel`.

- **useInterstitialAd** (`useinterstitialad.ts`)  
  Loads ad SDK, manages display frequency.

- **useAudioManager** (`useaudiomanager.ts`)  
  Preloads & plays sound effects (howler.js).

### UI Components

- **Header** (`header.tsx`)  
  Logo, deep-link input, share & settings buttons, responsive menu.

- **Footer** (`footer.tsx`)  
  Affiliate banner, legal links, version info, theme toggle.

- **CardPickerGrid** (`cardpickergrid.tsx`)  
  Lazy-loaded grid of `CardTile` components for squad selection.

- **CardTile** (`cardtile.tsx`)  
  Individual card tile with lazy-loaded image & flip animation.

- **BattleScreen** (`battlescreen.tsx`)  
  Runs Framer Motion transitions & attack animations.

- **ResultsOverlay** (`resultsoverlay.tsx`)  
  Shows duel outcome, updates win-streak, options to share/replay/settings.

- **ShareLinkModal** (`sharelinkmodal.tsx`)  
  Generates & copies deep-link URL for social sharing.

- **SettingsModal** (`settingsmodal.tsx`)  
  Toggles sound & theme preferences.

- **LoadingSpinner** (`loadingspinner.tsx`)  
  Global spinner for Suspense fallbacks & data loads.

### Monetization Components

- **InterstitialAdManager** (`interstitialadmanager.tsx`)  
  Asynchronously loads & displays full-screen ads.

- **AffiliateLinkBanner** (`affiliatelinkbanner.tsx`)  
  Fetches & shows affiliate link previews post-duel.

- **PremiumSkinModal** (`premiumskinmodal.tsx`)  
  In-app purchase flow for premium card skins (Stripe integration).

### Utilities & Services

- **AnalyticsService** (`analyticsservice.ts`)  
  Structured event logging (e.g., Google Analytics, Segment).

- **ErrorBoundary** (`errorboundary.tsx`)  
  Catches runtime React errors, logs them, and displays fallback UI.

### Entry Points & Config

- **index.js** / **app.jsx**  
  React DOM render & root app component bootstrap.

- **package.json**  
  NPM scripts & dependencies.

---

## Dependencies

- react, react-dom  
- react-router-dom  
- typescript  
- framer-motion  
- howler  
- stripe  
- your-ad-sdk (e.g., Google Ad Manager)  
- analytics provider SDK (e.g., Segment)  
- dev: eslint, prettier, jest (optional)

---

## Project Structure

```
??? public/
?   ??? index.html
??? src/
?   ??? index.js
?   ??? app.jsx
?   ??? app.tsx
?   ??? contexts/
?   ?   ??? settingscontext.tsx
?   ?   ??? duelcontext.tsx
?   ?   ??? winstreakcontext.tsx
?   ??? hooks/
?   ?   ??? uselocalstorage.ts
?   ?   ??? usequeryparams.ts
?   ?   ??? useduellogic.ts
?   ?   ??? useinterstitialad.ts
?   ?   ??? useaudiomanager.ts
?   ??? components/
?   ?   ??? Header.tsx
?   ?   ??? Footer.tsx
?   ?   ??? CardPickerGrid.tsx
?   ?   ??? CardTile.tsx
?   ?   ??? BattleScreen.tsx
?   ?   ??? ResultsOverlay.tsx
?   ?   ??? ShareLinkModal.tsx
?   ?   ??? SettingsModal.tsx
?   ?   ??? InterstitialAdManager.tsx
?   ?   ??? AffiliateLinkBanner.tsx
?   ?   ??? PremiumSkinModal.tsx
?   ?   ??? LoadingSpinner.tsx
?   ??? services/
?   ?   ??? analyticsservice.ts
?   ??? ErrorBoundary.tsx
??? package.json
```

---

## Contributing

1. Fork the repository  
2. Create a feature branch (`git checkout -b feature/YourFeature`)  
3. Commit your changes (`git commit -m "Add awesome feature"`)  
4. Push to the branch (`git push origin feature/YourFeature`)  
5. Open a Pull Request  

Please adhere to the existing code style and include tests where applicable.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.