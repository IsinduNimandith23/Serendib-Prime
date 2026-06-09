# Serendib Prime 🍛

A premium storefront for a Sri Lankan ready-to-eat (canned) curry business. Built with **Next.js 16**, **Tailwind CSS v4**, **Supabase** and **PayHere.lk**.

The two priorities: **showcase the product details beautifully** and **take payments smoothly**.

> **Runs out of the box.** With no configuration the site uses a bundled seed catalogue and a demo checkout, so you can develop and demo immediately. Add Supabase + PayHere keys to go fully live.

---

## ✨ Features

- **Elegant, fast storefront** — animated hero, bestsellers, story, categories, testimonials. Animations are transform/opacity only and respect `prefers-reduced-motion`, so they're smooth on any device.
- **Rich product pages** — full descriptions, ingredients, nutrition table, prep steps, spice meter, ratings.
- **Cart + slide-out drawer** with free-shipping progress, persisted to `localStorage`.
- **PayHere checkout** — server-side hash generation and a verified payment-notification webhook.
- **Custom admin dashboard** — Supabase-auth login, product CRUD, order management.
- **Self-contained visuals** — product packaging is rendered as crisp SVG (no external images to break or slow things down). Easily swapped for photography later.
- SEO: metadata, Open Graph, `sitemap.xml`, `robots.txt`.

## 🧱 Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind CSS v4 |
| Animation | Motion (`motion/react`) |
| State | Zustand (cart) |
| Database & Auth | Supabase |
| Payments | PayHere.lk |
| Fonts | Playfair Display + Karla |

---

## 🚀 Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. That's it — the storefront works with the bundled catalogue and a demo checkout.

To enable the database, admin and real payments, copy the env template and fill it in:

```bash
cp .env.example .env.local
```

---

## 🗄️ Supabase setup (admin + database)

1. Create a free project at [supabase.com](https://supabase.com).
2. **Project Settings → API** — copy into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (under "service_role" — keep secret)
3. **SQL Editor** → run [`supabase/schema.sql`](supabase/schema.sql), then [`supabase/seed.sql`](supabase/seed.sql) to import the starter catalogue.
4. **Authentication → Users → Add user** — create your admin email + password (and confirm it).
5. Restart `npm run dev`, then sign in at **`/admin`**.

When Supabase is connected, the storefront reads products from the DB and the admin manages them; otherwise it falls back to the seed in `src/lib/products.ts`.

---

## 💳 PayHere setup (payments)

1. Create a merchant account at [payhere.lk](https://www.payhere.lk) and complete verification.
2. **Settings → Domains & Credentials** — add your domain (and `localhost` for local testing if allowed) to get approved. Copy your credentials into `.env.local`:
   - `PAYHERE_MERCHANT_ID`
   - `PAYHERE_MERCHANT_SECRET`
   - `NEXT_PUBLIC_PAYHERE_MODE=sandbox` (switch to `live` when ready)
3. Set `NEXT_PUBLIC_APP_URL` to your public URL. PayHere calls `/api/payhere/notify` server-to-server, so for **local** testing expose your machine with a tunnel (e.g. `ngrok http 3000`) and use that URL.
4. Test with [PayHere sandbox cards](https://support.payhere.lk/api-&-mobile-sdk/sandbox-testing).

**How it works**
- `POST /api/payhere/initiate` re-prices the cart server-side, creates a `pending` order, and returns the PayHere fields incl. a securely generated `hash` (the merchant secret never leaves the server).
- The browser auto-submits those fields to PayHere's checkout.
- PayHere notifies `POST /api/payhere/notify`; we **verify the `md5sig`** before marking the order `paid`.

Until PayHere keys are present, checkout runs in **demo mode** (order recorded, success page shown, no charge).

---

## 🔐 Admin

- URL: `/admin` (redirects to `/admin/login`).
- Auth via Supabase email/password — any confirmed user can access.
- Manage products (create / edit / delete / feature) and orders (update status).

---

## ☁️ Deployment (Vercel recommended)

1. Push to GitHub and import into [Vercel](https://vercel.com).
2. Add all `.env.local` variables in the Vercel project settings.
3. Set `NEXT_PUBLIC_APP_URL` to your production domain and `NEXT_PUBLIC_PAYHERE_MODE=live`.
4. Add the production domain in your PayHere dashboard.

---

## 🎨 Customising

- **Brand name / contact** — search for `Serendib Prime` and the Negombo address/phone in `src/components/layout/`.
- **Colours / fonts** — design tokens live in `src/app/globals.css` (`@theme`) and fonts in `src/app/layout.tsx`.
- **Real photography** — swap the `<CanVisual>` component (`src/components/visual/CanVisual.tsx`) usages for `next/image`; remember to add the host to `images.remotePatterns` in `next.config.ts`.
- **Catalogue** — edit via the admin (DB) or `src/lib/products.ts` (seed).

## 📁 Structure

```
src/
  app/
    (store)/        Storefront (home, products, cart, checkout, about, contact)
    admin/          Admin login + (dash) dashboard, products, orders
    api/payhere/    initiate + notify routes
    api/contact/    contact form endpoint
  components/       layout · home · product · admin · ui · visual
  lib/              data, cart, orders, payhere, supabase clients, types
supabase/           schema.sql + seed.sql
```
