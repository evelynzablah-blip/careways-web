-- CareWays Collaborative — initial schema
-- Bilingual content uses paired columns (<field>_en / <field>_es).
-- Spanish columns are optional; the site falls back to English.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------------------------------------------------------------------------
-- Profiles / roles
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  -- New accounts start inactive. Admins activate them through the invite flow,
  -- so an accidental public sign-up never grants access.
  active boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', null))
  on conflict (id) do nothing;
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and active);
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and active and role = 'admin');
$$;

-- ---------------------------------------------------------------------------
-- Blog posts
-- ---------------------------------------------------------------------------
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title_en text not null,
  title_es text,
  excerpt_en text,
  excerpt_es text,
  body_en text,
  body_es text,
  cover_image_path text,
  cover_alt_en text,
  cover_alt_es text,
  category text,
  country_codes text[] not null default '{}',
  author_name text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index posts_status_published_idx on public.posts (status, published_at desc);
create trigger posts_updated_at before update on public.posts for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Newsletters / mission reports
-- ---------------------------------------------------------------------------
create table public.mission_reports (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  issue_number integer,
  series text,
  title_en text not null,
  title_es text,
  excerpt_en text,
  excerpt_es text,
  body_en text,
  body_es text,
  highlights_en text[] not null default '{}',
  highlights_es text[] not null default '{}',
  report_date date not null,
  date_note text,
  country_codes text[] not null default '{}',
  cover_image_path text,
  pdf_path text,
  source_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index mission_reports_status_date_idx on public.mission_reports (status, report_date desc);
create trigger mission_reports_updated_at before update on public.mission_reports for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Team, partners, map
-- ---------------------------------------------------------------------------
create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  role_en text,
  role_es text,
  affiliation_en text,
  affiliation_es text,
  bio_en text,
  bio_es text,
  photo_path text,
  sort_order integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger team_members_updated_at before update on public.team_members for each row execute function public.set_updated_at();

create table public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null default 'sponsor' check (type in ('hospital', 'sponsor')),
  logo_path text,
  url text,
  sort_order integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger partners_updated_at before update on public.partners for each row execute function public.set_updated_at();

-- Reports and posts are linked to a pin through country_codes.
create table public.map_locations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  country_code text not null check (country_code ~ '^[A-Z]{2}$'),
  country_en text not null,
  country_es text not null,
  hospital_name text not null,
  lat double precision not null check (lat between -90 and 90),
  lng double precision not null check (lng between -180 and 180),
  url text,
  summary_en text,
  summary_es text,
  sort_order integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger map_locations_updated_at before update on public.map_locations for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Media library (files live in Storage; this table holds metadata)
-- ---------------------------------------------------------------------------
create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null check (bucket in ('media', 'documents')),
  path text not null,
  kind text not null default 'other' check (kind in ('image', 'pdf', 'other')),
  alt_en text,
  alt_es text,
  size_bytes bigint,
  mime_type text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (bucket, path)
);

-- ---------------------------------------------------------------------------
-- Forms
-- ---------------------------------------------------------------------------
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  reason text not null,
  message text not null,
  locale text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index contact_messages_created_idx on public.contact_messages (created_at desc);

create table public.newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  first_name text,
  locale text,
  source text,
  -- stored: kept locally (no provider configured) · pending/synced/failed: Constant Contact sync state
  status text not null default 'stored' check (status in ('stored', 'pending', 'synced', 'failed')),
  error text,
  created_at timestamptz not null default now()
);
create index newsletter_signups_created_idx on public.newsletter_signups (created_at desc);

-- ---------------------------------------------------------------------------
-- Settings and private integration secrets
-- ---------------------------------------------------------------------------
create table public.site_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

-- Never exposed through the API: RLS is enabled with no policies, so only
-- the service role (server code) can read or write it.
create table public.integration_secrets (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);
