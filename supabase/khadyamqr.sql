begin;

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  email text primary key,
  role text not null default 'admin' check (role in ('admin'))
);

create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text,
  qr_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  image_url text,
  available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_restaurants_updated_at on public.restaurants;
create trigger trg_restaurants_updated_at before update on public.restaurants
for each row execute function public.set_updated_at();

drop trigger if exists trg_menu_items_updated_at on public.menu_items;
create trigger trg_menu_items_updated_at before update on public.menu_items
for each row execute function public.set_updated_at();

alter table public.restaurants enable row level security;
alter table public.menu_items enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "restaurants_select_all" on public.restaurants;
create policy "restaurants_select_all" on public.restaurants
for select using (true);

drop policy if exists "restaurants_admin_write" on public.restaurants;
create policy "restaurants_admin_write" on public.restaurants
for insert to authenticated with check (exists(select 1 from public.admin_users au where au.email = auth.email()));
create policy "restaurants_admin_update" on public.restaurants
for update to authenticated using (exists(select 1 from public.admin_users au where au.email = auth.email()))
with check (exists(select 1 from public.admin_users au where au.email = auth.email()));
create policy "restaurants_admin_delete" on public.restaurants
for delete to authenticated using (exists(select 1 from public.admin_users au where au.email = auth.email()));

drop policy if exists "menu_items_select_all" on public.menu_items;
create policy "menu_items_select_all" on public.menu_items
for select using (true);

drop policy if exists "menu_items_admin_insert" on public.menu_items;
create policy "menu_items_admin_insert" on public.menu_items
for insert to authenticated with check (exists(select 1 from public.admin_users au where au.email = auth.email()));
create policy "menu_items_admin_update" on public.menu_items
for update to authenticated using (exists(select 1 from public.admin_users au where au.email = auth.email()))
with check (exists(select 1 from public.admin_users au where au.email = auth.email()));
create policy "menu_items_admin_delete" on public.menu_items
for delete to authenticated using (exists(select 1 from public.admin_users au where au.email = auth.email()));

insert into public.admin_users (email, role) values ('sbarsagade.s22@gmail.com','admin')
on conflict (email) do update set role = excluded.role;

insert into storage.buckets (id, name, public) values ('khadyamqr','khadyamqr', true)
on conflict (id) do nothing;


drop policy if exists "khadyamqr_public_read" on storage.objects;
create policy "khadyamqr_public_read" on storage.objects
for select using (bucket_id = 'khadyamqr');

drop policy if exists "khadyamqr_admin_write" on storage.objects;
create policy "khadyamqr_admin_write" on storage.objects
for insert to authenticated with check (bucket_id = 'khadyamqr' and exists(select 1 from public.admin_users au where au.email = auth.email()));
create policy "khadyamqr_admin_update" on storage.objects
for update to authenticated using (bucket_id = 'khadyamqr' and exists(select 1 from public.admin_users au where au.email = auth.email()))
with check (bucket_id = 'khadyamqr' and exists(select 1 from public.admin_users au where au.email = auth.email()));
create policy "khadyamqr_admin_delete" on storage.objects
for delete to authenticated using (bucket_id = 'khadyamqr' and exists(select 1 from public.admin_users au where au.email = auth.email()));

commit;
