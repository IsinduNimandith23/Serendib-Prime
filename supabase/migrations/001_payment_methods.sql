-- ============================================================
-- Serendib Prime — Payment methods migration
-- Adds COD / bank-transfer support to an EXISTING database.
-- Safe to run multiple times (idempotent). Paste into the
-- Supabase SQL Editor and run.
-- ============================================================

-- ---------- Orders: new columns ----------
-- How the customer chose to pay: 'payhere' | 'bank' | 'cod'.
alter table public.orders
  add column if not exists payment_method text not null default 'payhere';

-- Bank transfer only: which owner account they paid to (label) + the storage
-- path of the uploaded receipt in the private 'payment-receipts' bucket.
alter table public.orders
  add column if not exists bank_account text;

alter table public.orders
  add column if not exists receipt_path text;

-- ---------- Storage: private receipts bucket ----------
-- Receipts are uploaded with the service-role key and only ever read by admins
-- via short-lived signed URLs, so the bucket stays private (public = false).
insert into storage.buckets (id, name, public)
values ('payment-receipts', 'payment-receipts', false)
on conflict (id) do nothing;
