-- Row Level Security. Anonymous visitors only read published / visible rows.
-- Active editors and admins manage content; admin-only areas are noted.

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.mission_reports enable row level security;
alter table public.team_members enable row level security;
alter table public.partners enable row level security;
alter table public.map_locations enable row level security;
alter table public.media_assets enable row level security;
alter table public.contact_messages enable row level security;
alter table public.newsletter_signups enable row level security;
alter table public.site_settings enable row level security;
alter table public.integration_secrets enable row level security;

-- Profiles: everyone signed in sees their own profile; admins see and manage all.
create policy "profiles: read own" on public.profiles for select to authenticated using (id = auth.uid());
create policy "profiles: admin read" on public.profiles for select to authenticated using (public.is_admin());
create policy "profiles: admin update" on public.profiles for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- Posts
create policy "posts: public read published" on public.posts for select to anon, authenticated using (status = 'published');
create policy "posts: staff read all" on public.posts for select to authenticated using (public.is_staff());
create policy "posts: staff insert" on public.posts for insert to authenticated with check (public.is_staff());
create policy "posts: staff update" on public.posts for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "posts: admin delete" on public.posts for delete to authenticated using (public.is_admin());

-- Mission reports
create policy "reports: public read published" on public.mission_reports for select to anon, authenticated using (status = 'published');
create policy "reports: staff read all" on public.mission_reports for select to authenticated using (public.is_staff());
create policy "reports: staff insert" on public.mission_reports for insert to authenticated with check (public.is_staff());
create policy "reports: staff update" on public.mission_reports for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "reports: admin delete" on public.mission_reports for delete to authenticated using (public.is_admin());

-- Team, partners, map: public sees visible rows, staff manage, admins delete.
create policy "team: public read visible" on public.team_members for select to anon, authenticated using (visible);
create policy "team: staff read all" on public.team_members for select to authenticated using (public.is_staff());
create policy "team: staff write" on public.team_members for insert to authenticated with check (public.is_staff());
create policy "team: staff update" on public.team_members for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "team: admin delete" on public.team_members for delete to authenticated using (public.is_admin());

create policy "partners: public read visible" on public.partners for select to anon, authenticated using (visible);
create policy "partners: staff read all" on public.partners for select to authenticated using (public.is_staff());
create policy "partners: staff write" on public.partners for insert to authenticated with check (public.is_staff());
create policy "partners: staff update" on public.partners for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "partners: admin delete" on public.partners for delete to authenticated using (public.is_admin());

create policy "map: public read visible" on public.map_locations for select to anon, authenticated using (visible);
create policy "map: staff read all" on public.map_locations for select to authenticated using (public.is_staff());
create policy "map: staff write" on public.map_locations for insert to authenticated with check (public.is_staff());
create policy "map: staff update" on public.map_locations for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "map: admin delete" on public.map_locations for delete to authenticated using (public.is_admin());

-- Media library metadata: staff only.
create policy "media: staff read" on public.media_assets for select to authenticated using (public.is_staff());
create policy "media: staff insert" on public.media_assets for insert to authenticated with check (public.is_staff());
create policy "media: staff update" on public.media_assets for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "media: admin delete" on public.media_assets for delete to authenticated using (public.is_admin());

-- Contact messages and newsletter log: admins only. Public inserts go
-- through the server (service role), never directly from the browser.
create policy "contact: admin read" on public.contact_messages for select to authenticated using (public.is_admin());
create policy "contact: admin update" on public.contact_messages for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "contact: admin delete" on public.contact_messages for delete to authenticated using (public.is_admin());

create policy "newsletter: admin read" on public.newsletter_signups for select to authenticated using (public.is_admin());

-- Site settings are public (no secrets here); only admins change them.
create policy "settings: public read" on public.site_settings for select to anon, authenticated using (true);
create policy "settings: admin insert" on public.site_settings for insert to authenticated with check (public.is_admin());
create policy "settings: admin update" on public.site_settings for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- integration_secrets: intentionally no policies.
