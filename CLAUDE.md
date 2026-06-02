# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A "catalog-style" e-commerce site (no checkout, no payment gateway) for **Los Álamos**, a workwear/industrial-clothing brand. Users browse products and contact the business via WhatsApp or a quote form ("cotización"). Content (products, categories, images, color variants) is managed in **Directus**; the **Next.js** frontend consumes Directus's public read-only API. See `CONTEXT.md` for the full data model spec (in Spanish) — it is the source of truth for collections, fields, and permissions.

## Repository layout

- `frontend/` — the Next.js 16 (App Router) + React 19 + Tailwind v4 application. **All `npm`/`next` commands run from here**, not the repo root.
- `docker-compose.yml` (repo root) — self-hosted Directus + PostgreSQL stack for local CMS development.
- `CONTEXT.md`, `snapshot.json`, `textos.md` — project spec, Directus schema snapshot, and copy/content notes.

## Commands

Run from `frontend/`:

```bash
npm run dev      # Next.js dev server on http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint (flat config, eslint-config-next)
```

There is no test suite. `npm run lint` is the only automated check.

Local CMS (from repo root, requires a `.env` with `DB_PASSWORD`, `DIRECTUS_KEY`, `DIRECTUS_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`):

```bash
docker compose up -d   # Directus on http://localhost:8055, Postgres alongside
```

## Architecture

**Data flow: Directus → `src/lib/directus.ts` → Server Components.** All product/category reads go through the typed helper functions in `src/lib/directus.ts` (`fetchProducts`, `fetchProductBySlug`, `fetchCategories`, etc.). These hit Directus's REST API (`/items/...`) with `fields=...` expansions and `next: { revalidate: 60 }` ISR caching. Pages (`src/app/.../page.tsx`) are async Server Components that call these helpers directly — there is no client-side data-fetching library.

**Directus quirks the helpers absorb (don't bypass them):**
- Images are an M2M to `directus_files`, so each image item is `{ directus_files_id: {...} | "uuid" | null }`. Use `getProductImageIds` / `getFirstImage` rather than reading `product.images` directly — they handle the expanded-object vs. bare-UUID vs. empty cases.
- Asset URLs are built with `assetUrl(fileId)` → `${DIRECTUS_URL}/assets/<uuid>`. Never hardcode asset URLs.
- Products have **color variants** (`color_variants`), each with its own image set and a `disponibilidad` status (`disponible` | `sin_stock` | `proximamente`). Variant images use the same M2M shape; use `getVariantImageIds`.
- `ficha_tecnica` (a single PDF file) may arrive as a UUID string or an object; use `getFichaTecnicaUrl`.

**Types** in `src/types/directus.ts` mirror the Directus collections and should be kept in sync with `CONTEXT.md` when the schema changes.

**Quote form ("cotización") — the one write path.** `POST /api/cotizacion` (`src/app/api/cotizacion/route.ts`) validates the form, writes a row to the Directus `cotizaciones` collection (with `estado: "nueva"`), and fires a notification email via `src/lib/mail.ts` (nodemailer over Gmail SMTP) without blocking the response. The public Directus role only has create on `cotizaciones`; everything else is read-only.

**Admin view.** `/admin/cotizaciones` is a client page that prompts for an admin key (held in `sessionStorage`) and sends it as the `x-admin-key` header to `GET /api/admin/cotizaciones`. That route checks the key against `ADMIN_SECRET`, then reads `cotizaciones` from Directus using a privileged `DIRECTUS_READ_TOKEN` Bearer token. This is the only authenticated server route.

**WhatsApp** (`src/lib/whatsapp.ts`) supports 1–3 configurable sales lines via env and builds `wa.me` deep links with pre-filled messages (general, per-product, per-color). The floating button in the root layout renders these lines.

## Environment variables

Frontend (`frontend/.env.local`):
- `NEXT_PUBLIC_DIRECTUS_URL` — **required**; helpers throw if unset.
- `NEXT_PUBLIC_SITE_URL` — base URL for `sitemap.ts` (defaults to localhost).
- `NEXT_PUBLIC_WHATSAPP_NUMBER` or `NEXT_PUBLIC_WHATSAPP_NUMBER_1..3` + `NEXT_PUBLIC_WHATSAPP_LABEL_1..3` — sales lines.
- `NEXT_PUBLIC_INSTAGRAM_URL`, `NEXT_PUBLIC_LINKEDIN_URL` — header social links.
- `SMTP_USER`, `SMTP_PASS`, `NOTIFY_EMAIL` — Gmail SMTP + recipient for quote notifications.
- `ADMIN_SECRET`, `DIRECTUS_READ_TOKEN` — protect and power the admin cotizaciones route.

When adding a new Directus host for images, add it to `images.remotePatterns` in `next.config.ts` or `next/image` will reject it.

## Conventions

- Code identifiers are English; user-facing copy, comments, and the data model are Spanish — match the surrounding file.
- Import alias `@/` maps to `frontend/src/`.
- Prefer keeping data access in `src/lib/directus.ts` (Server Component, ISR-cached) over fetching in client components.
