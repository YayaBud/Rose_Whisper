# replit.md

## Overview

"Just Say Yes" is a playful, romantic Valentine's Day proposal app built for someone named "Ruiii." It's a single-screen interactive experience where the user is asked "Will you be my Valentine?" with an elaborate flow: typewriter-style intro text, a question screen with YES/NO buttons (where the NO button misbehaves — moving away, showing funny messages), and a celebration screen with heart explosions and animations upon pressing YES. The app uses Expo (React Native) for the frontend and Express for the backend API server, with a PostgreSQL database configured via Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (Expo / React Native)
- **Framework**: Expo SDK 54 with React Native 0.81, using the new architecture (`newArchEnabled: true`)
- **Routing**: expo-router with file-based routing. The app directory contains the route files (`app/index.tsx` is the main screen, `app/_layout.tsx` is the root layout)
- **State Management**: TanStack React Query (`@tanstack/react-query`) for server state, React's `useState` for local UI state
- **Animations**: `react-native-reanimated` is used extensively for all animations — floating hearts, heart explosions, button chaos, typewriter effects, and celebration sequences
- **Fonts**: Custom Google Font `DancingScript` (handwritten style) loaded via `@expo-google-fonts/dancing-script`
- **Styling**: Plain React Native `StyleSheet` objects with a custom color constants file (`constants/colors.ts`) defining a pink/rose/blush theme
- **Key Components**:
  - `FloatingCharacters` — animated background particles (hearts, stars, flowers, etc.)
  - `HeartExplosion` — burst animation on YES
  - `TypewriterText` — text that appears character by character
  - `ErrorBoundary` — class component error boundary with fallback UI
- **Platform**: Primarily targeting mobile (iOS/Android), portrait orientation, with web support via `react-native-web`

### Backend (Express)
- **Framework**: Express 5 running on Node.js
- **Server entry**: `server/index.ts` — sets up CORS (allowing Replit domains and localhost), JSON parsing, and serves static files in production
- **Routes**: `server/routes.ts` — currently minimal, just creates an HTTP server. API routes should be prefixed with `/api`
- **Storage**: `server/storage.ts` — uses an in-memory storage implementation (`MemStorage`) with a `Map`. An `IStorage` interface is defined for future database integration
- **Development**: Uses `tsx` for TypeScript execution (`server:dev` script)
- **Production build**: Uses `esbuild` to bundle the server, and Expo's static export for the frontend

### Database (PostgreSQL + Drizzle ORM)
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Defined in `shared/schema.ts` — currently has a `users` table with `id` (UUID), `username`, and `password` fields
- **Validation**: `drizzle-zod` generates Zod schemas from Drizzle table definitions
- **Migrations**: Output to `./migrations` directory, managed via `drizzle-kit push` command
- **Current state**: The database schema exists but the app currently uses in-memory storage (`MemStorage`). The database connection requires a `DATABASE_URL` environment variable

### Shared Code
- The `shared/` directory contains code shared between frontend and backend (currently just the database schema and types)
- Path aliases are configured: `@/*` maps to root, `@shared/*` maps to `./shared/*`

### Build & Deployment
- Development runs two processes: Expo dev server for the mobile app and Express server for the API
- Production uses Expo's static web export bundled and served by the Express server
- The `scripts/build.js` handles the static build process for deployment on Replit

## External Dependencies

### Core Services
- **PostgreSQL Database**: Required via `DATABASE_URL` environment variable. Used with Drizzle ORM for data persistence
- **Replit Environment**: The app is designed to run on Replit, using environment variables like `REPLIT_DEV_DOMAIN`, `REPLIT_DOMAINS`, and `REPLIT_INTERNAL_APP_DOMAIN` for CORS and URL configuration

### Key NPM Packages
- **expo** (~54.0.27) — Core framework for React Native development
- **express** (^5.0.1) — Backend HTTP server
- **drizzle-orm** (^0.39.3) + **drizzle-kit** — Database ORM and migration tools
- **pg** (^8.16.3) — PostgreSQL client for Node.js
- **@tanstack/react-query** (^5.83.0) — Data fetching and caching
- **react-native-reanimated** (~4.1.1) — High-performance animations
- **expo-haptics** — Haptic feedback on button interactions
- **expo-linear-gradient** — Gradient backgrounds
- **expo-image-picker** — Image selection capability
- **zod** + **drizzle-zod** — Runtime type validation

### Fonts
- **DancingScript** (Google Fonts) — Handwritten-style font used for romantic text display