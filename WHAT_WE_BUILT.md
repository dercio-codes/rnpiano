# What we built

The website for **RNPiano**, DJ ShadzO's brand: amapiano mixed with R&B vocals. ShadzO is Johannesburg-based and plays gigs in Durban, Cape Town, Gqeberha and across South Africa.

Stack: Next.js 16 (App Router, Cache Components), React 19, TypeScript. Repo: https://github.com/dercio-codes/rnpiano (`main`).

## Public site (`/`)

One page with these sections:

| Section | What it is |
| --- | --- |
| Hero | RNPiano title, "Amapiano grooves with R&B vocals" tagline, and a silent, decorative piano keyboard (keys press down on click or tap, no sound) |
| Destiny | The new album, out 3 July 2026 on RnPiano Records |
| Music | Singles and releases from `lib/catalog.ts`, with a listen menu linking out to streaming platforms |
| Mixes | Live mix embeds, e.g. RnPiano Chillas, recorded at Wild Waters in Boksburg |
| About ("The ShadzO Experience") | What RNPiano is: a mix series, a record label and a night out |
| Book | Booking request form (name, contact, event type, performance type, date, venue, message) |
| Footer | RNPiano wordmark logo and a scrolling marquee of piano keys |

Extras: scroll and reveal animations (respecting `prefers-reduced-motion`), SEO metadata and JSON-LD, Open Graph and Twitter images, `robots.txt`, `sitemap.xml`, and a web app manifest.

### Booking form

- `components/BookingForm.tsx` posts to the `submitBooking` server action in `app/actions.ts`.
- Validation lives in `lib/booking.ts`. A hidden honeypot field catches bots.
- **Not finished:** valid requests are only logged to the server console. Delivery (email or database) is still a TODO.

## Hidden admin area

- **`/login`**: not linked anywhere on the site, `noindex`, and disallowed in `robots.txt`. One shared account, with the username and password coming from environment variables.
- **`/admin/bookings`**: booking requests dashboard (currently **demo data** from `lib/demo-bookings.ts`), with search and status tabs, calendar export (`lib/calendar.ts`) and an invoice builder that produces PDFs (`lib/invoice.ts`, `@react-pdf/renderer`).
- A log out button sits in the admin header.

### How the login works

| Piece | File |
| --- | --- |
| Signed session cookie (HMAC-SHA256, httpOnly, 7 days) | `lib/session.ts` |
| Login and logout server actions (constant-time compare, 800ms delay on failure) | `app/login/actions.ts` |
| Login page and form | `app/login/page.tsx`, `components/LoginForm.tsx` |
| Redirects `/admin/*` to `/login` without a session | `proxy.ts` |
| Re-checks the session inside the admin page | `lib/auth.ts` |

### Environment variables

Set these locally in `.env.local` (gitignored) **and** in the hosting provider's settings, then redeploy:

```
ADMIN_USERNAME=rnpiano
ADMIN_PASSWORD=<strong password>
SESSION_SECRET=<long random string, e.g. openssl rand -hex 32>
```

`.env.example` lists the names with blank values. Never commit real values.

## Project map

```
app/
  page.tsx            the public page
  actions.ts          booking form server action
  login/              hidden login page and actions
  admin/bookings/     admin dashboard
  layout.tsx          metadata, fonts
  globals.css         all styles
  manifest.ts, robots.ts, sitemap.ts
components/           Piano, BookingForm, ListenMenu, ScrollFX, LoginForm, admin/*
lib/                  site config, catalog, booking validation, session/auth, invoice, calendar
proxy.ts              admin route protection
public/               logo, wordmark, cover art
```

## PWA

The site is installable and works offline for the home page.

- `app/manifest.ts`: name, standalone display, 192/512/maskable icons (`public/icons/`), "Book" shortcut.
- `public/sw.js`: precaches `/` and icons. Pages are network-first with a cached fallback, and static assets are cache-first. `/admin`, `/login`, `/api` and POSTs are never cached. Bump `VERSION` in the file to invalidate caches after a big change.
- `components/RegisterSW.tsx`: registers the worker in production only (HTTPS or localhost).
- `next.config.ts`: serves `/sw.js` with no-cache and a strict CSP so updates roll out.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
npm run lint
```

## Still open

- Send booking requests somewhere real (email or database) and replace the admin's demo data with them.
- Optional: show a clear "server not configured" message on `/login` when the environment variables are missing.
