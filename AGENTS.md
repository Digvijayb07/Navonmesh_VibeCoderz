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

The API route `app/api/buyer-info/route.ts` uses Supabase admin client (service role key via `SUPABASE_SERVICE_ROLE_KEY`) to look up user info by ID.

### Database Tables (Supabase)

The app interacts with these Supabase tables:
- **`profiles`** — User profiles (id, full_name, role, phone, village, district, state). Upserted on signup and OAuth callback.
- **`produce_listings`** — Crop listings (farmer_id, crop_name, quantity, unit, price_per_kg, quality_grade, location, status).
- **`exchange_requests`** — Buy/barter requests linking a buyer to a listing (listing_id, buyer_id, quantity_requested, offer_crop_name, offer_quantity, offer_unit, status). Joined with `produce_listings` and `profiles` via foreign keys.
- **`notifications`** — User notifications (user_id, message, is_read). Real-time subscriptions via Supabase Realtime in `components/notification-bell.tsx`.

### UI Components

- **shadcn/ui** (new-york style, RSC-enabled): All primitives live in `components/ui/`. Configured via `components.json`. Add new components with `npx shadcn@latest add <component>`.
- **Custom app components** in `components/`: `app-layout`, `sidebar`, `top-nav`, `notification-bell`, `stat-card`, `price-chart`, `market-alerts`.
- **Styling**: Tailwind CSS v4 with `@tailwindcss/postcss`. Custom CSS variables (oklch color space) defined in `app/globals.css` for light/dark themes. Use `cn()` from `lib/utils.ts` for conditional class merging.

### Path Aliases

TypeScript path alias `@/*` maps to the project root (configured in `tsconfig.json`). Always use `@/` imports.

### Key Patterns

- **Client vs Server**: Pages doing Supabase queries client-side (marketplace, exchange) are `'use client'` components. Static/presentational pages (logistics, trust-profile, analytics, disputes, settings, market-prices) are Server Components with hardcoded data.
- **Exchange workflow states**: `pending` → `accepted` → `in_transit` → `completed` (or `rejected`). Farmer accepts/rejects and marks in-transit; buyer marks received. Status changes trigger notifications and inventory deduction.
- **Auth flow**: Email/password signup sends confirmation email → user confirms → login. Google OAuth redirects through `/auth/callback` which upserts a profile row.

### Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` — Service role key (server-side only, used by `/api/buyer-info`)
- `SITE_URL` / `NEXT_PUBLIC_SITE_URL` — Base URL for redirects

### Notable Config

- `next.config.mjs` has `typescript.ignoreBuildErrors: true` and `images.unoptimized: true`.
- Vercel Analytics is included in the root layout.
