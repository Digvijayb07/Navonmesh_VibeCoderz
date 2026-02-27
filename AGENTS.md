# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

FarmLink is an agricultural exchange platform connecting farmers, buyers, and transporters. Built with Next.js 16 (App Router), React 19, Supabase (auth + database), Tailwind CSS v4, and shadcn/ui.

## Build & Development Commands

- `npm run dev` — Start dev server (Next.js)
- `npm run build` — Production build
- `npm run lint` — Run ESLint (`eslint .`)
- `npm run start` — Start production server

Both `package-lock.json` (npm) and `pnpm-lock.yaml` exist; prefer `npm` for consistency with lock file.

No test framework is currently configured.

## Architecture

### App Router Structure

Uses Next.js App Router with `app/` directory. All pages use the `(auth)` route group for authentication flows and top-level routes for authenticated features.

- **Layout**: `app/layout.tsx` is the root layout (no auth wrapper — auth is handled per-page or via middleware-to-be-added).
- **Shell**: Every authenticated page wraps content in `<AppLayout>` (from `components/app-layout.tsx`), which renders `<Sidebar>` + `<TopNav>` + main content area.
- **Route group `(auth)/`**: Contains `/login`, `/signup`, `/logout`, and `/auth/callback` + `/auth/confirm` route handlers for OAuth and email confirmation flows.

### Supabase Integration

Three Supabase client variants in `utils/supabase/`:
- `client.ts` — Browser client (`createBrowserClient`). Also exports a singleton `supabase` instance.
- `server.ts` — Server client (`createServerClient` with cookie access). Used in Server Components and Server Actions.
- `middleware.ts` — Session refresh helper for Next.js middleware (exports `updateSession`). Note: no root `middleware.ts` file currently exists to call it.

Server Actions for auth live in `lib/auth-actions.ts` (`login`, `signup`, `signout`, `getUser`).

### API Routes

- `app/api/buyer-info/route.ts` — Uses Supabase admin client (service role key via `SUPABASE_SERVICE_ROLE_KEY`) to look up user info by ID.
- `app/api/send-otp/route.ts` — Generates a 6-digit OTP, bcrypt-hashes it, stores it in `phone_otp_challenges`, and sends via Twilio SMS. Falls back to returning the OTP in the response when Twilio credentials are missing (dev/demo mode).
- `app/api/verify-otp/route.ts` — Validates OTP against the hash, enforces 5-attempt max and 5-minute expiry, then updates `profiles.phone_verified` on success.

### Database Tables (Supabase)

The app interacts with these Supabase tables:
- **`profiles`** — User profiles (id, full_name, role, phone, phone_verified, phone_verified_at, village, district, state, trust_score, total_completed, total_failed). Upserted on signup and OAuth callback.
- **`produce_listings`** — Crop listings (farmer_id, crop_name, quantity, unit, price_per_kg, quality_grade, location, status, latitude, longitude, address). Location columns added via `supabase_migration_location.sql`.
- **`exchange_requests`** — Buy/barter requests linking a buyer to a listing (listing_id, buyer_id, quantity_requested, offer_crop_name, offer_quantity, offer_unit, status). Joined with `produce_listings` and `profiles` via foreign keys.
- **`notifications`** — User notifications (user_id, message, is_read). Real-time subscriptions via Supabase Realtime in `components/notification-bell.tsx`.
- **`phone_otp_challenges`** — Stores hashed OTP codes for phone verification (user_id, phone, code_hash, expires_at, attempts). Created via `supabase_migration_otp.sql`.

SQL migration files (`supabase_migration_*.sql`) are run manually in the Supabase SQL Editor.

### UI Components

- **shadcn/ui** (new-york style, RSC-enabled): All primitives live in `components/ui/`. Configured via `components.json`. Add new components with `npx shadcn@latest add <component>`.
- **Custom app components** in `components/`: `app-layout`, `sidebar`, `top-nav`, `notification-bell`, `stat-card`, `price-chart`, `market-alerts`, `mandi-price-ticker`, `mini-market-map`, `trust-score-stat`.
- **Styling**: Tailwind CSS v4 with `@tailwindcss/postcss`. Custom CSS variables (oklch color space) defined in `app/globals.css` for light/dark themes. Use `cn()` from `lib/utils.ts` for conditional class merging.

### Path Aliases

TypeScript path alias `@/*` maps to the project root (configured in `tsconfig.json`). Always use `@/` imports.

### Key Patterns

- **Client vs Server**: Pages doing Supabase queries client-side (marketplace, exchange) are `'use client'` components. Static/presentational pages (logistics, trust-profile, analytics, disputes, settings, market-prices) are Server Components with hardcoded data.
- **Exchange workflow states**: `pending` → `accepted` → `in_transit` → `completed` (or `rejected`). Farmer accepts/rejects and marks in-transit; buyer marks received. Status changes trigger notifications, inventory deduction, and trust score updates.
- **Trust score system**: Calculated as `(total_completed / (total_completed + total_failed)) * 100`, stored on `profiles`. Updated on exchange completion (both parties get credit) and rejection (buyer gets penalized). Displayed as a 0–5 scale in the UI (`score / 20`).
- **Auth flow**: Email/password signup sends confirmation email → user confirms → login. Google OAuth redirects through `/auth/callback` which upserts a profile row.
- **Phone OTP verification**: Profile page → enter phone → `POST /api/send-otp` → enter 6-digit code → `POST /api/verify-otp`. Twilio sends the SMS in production; in dev mode, the OTP is returned in the API response.
- **Geo & proximity features**: `lib/geo.ts` provides Haversine distance calculation and Nominatim (OpenStreetMap) geocoding. The marketplace page sorts/filters listings by distance when the buyer shares their location, and renders them on a Leaflet map.
- **Leaflet/react-leaflet SSR caveat**: `MiniMarketMap` must be imported via `next/dynamic` with `ssr: false` because Leaflet accesses `window`. See `app/marketplace/page.tsx` for the pattern.
- **Live Mandi prices**: `MandiPriceTicker` fetches commodity prices from the data.gov.in API and renders a scrolling ticker on the dashboard.

### Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` — Service role key (server-side only, used by `/api/buyer-info`)
- `SITE_URL` / `NEXT_PUBLIC_SITE_URL` — Base URL for redirects

Optional (for SMS OTP verification):
- `TWILIO_ACCOUNT_SID` — Twilio account SID
- `TWILIO_AUTH_TOKEN` — Twilio auth token
- `TWILIO_PHONE_NUMBER` — Twilio sender phone number

When Twilio env vars are absent, `/api/send-otp` falls back to returning the OTP in the JSON response for dev/testing.

### Notable Config

- `next.config.mjs` has `typescript.ignoreBuildErrors: true` and `images.unoptimized: true`.
- Vercel Analytics is included in the root layout.
