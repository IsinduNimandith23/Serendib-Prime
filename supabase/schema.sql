-- ============================================================
-- Serendib Prime - Supabase schema
-- Run this in the Supabase SQL Editor before seeding.
-- ============================================================

-- ---------- Products ----------
create table if not exists public.products (
  id                 uuid primary key default gen_random_uuid(),
  slug               text unique not null,
  name               text not null,
  name_si            text,
  name_ta            text,
  tagline            text,
  image_url          text,
  category           text not null,
  price              numeric not null,
  weight             text,
  short_description  text,
  description        text,
  ingredients        jsonb not null default '[]',
  nutrition          jsonb not null default '{}',
  spice_level        int not null default 1,
  badges             jsonb not null default '[]',
  accent             text not null default '#b5371f',
  prep_steps         jsonb not null default '[]',
  serving_suggestion text,
  featured           boolean not null default false,
  active             boolean not null default true,
  in_stock           boolean not null default true,
  rating             numeric not null default 0,
  reviews            int not null default 0,
  sort_order         int not null default 100,
  created_at         timestamptz not null default now()
);

-- ---------- Orders ----------
create table if not exists public.orders (
  id                 uuid primary key default gen_random_uuid(),
  order_ref          text unique not null,
  customer_name      text not null,
  email              text not null,
  phone              text,
  address            text,
  city               text,
  postal_code        text,
  items              jsonb not null default '[]',
  subtotal           numeric not null,
  shipping           numeric not null,
  total              numeric not null,
  status             text not null default 'pending',
  payhere_payment_id text,
  created_at         timestamptz not null default now()
);

-- ---------- Contact messages (optional) ----------
create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  name       text,
  email      text,
  message    text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- The service-role key (used in server routes) bypasses RLS, so
-- order/message writes always work. These policies govern the
-- anon (storefront) and authenticated (admin) keys.
-- ============================================================
alter table public.products enable row level security;
alter table public.orders   enable row level security;
alter table public.messages enable row level security;

-- Storefront: anyone may read active products.
drop policy if exists "public_read_active_products" on public.products;
create policy "public_read_active_products"
  on public.products for select
  using (active = true);

-- Admin: any signed-in user may read & manage all products.
drop policy if exists "auth_manage_products" on public.products;
create policy "auth_manage_products"
  on public.products for all
  to authenticated
  using (true) with check (true);

-- Admin: signed-in users may read & update orders.
drop policy if exists "auth_read_orders" on public.orders;
create policy "auth_read_orders"
  on public.orders for select
  to authenticated
  using (true);

drop policy if exists "auth_update_orders" on public.orders;
create policy "auth_update_orders"
  on public.orders for update
  to authenticated
  using (true) with check (true);

-- Admin: signed-in users may read messages.
drop policy if exists "auth_read_messages" on public.messages;
create policy "auth_read_messages"
  on public.messages for select
  to authenticated
  using (true);

-- Helpful index for catalogue ordering.
create index if not exists products_sort_idx on public.products (sort_order);
create index if not exists orders_created_idx on public.orders (created_at desc);
