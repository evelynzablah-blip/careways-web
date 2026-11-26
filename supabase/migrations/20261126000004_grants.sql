-- Table privileges for the API roles.
-- New Supabase projects no longer grant these automatically for tables created
-- in migrations, so without this file every API call fails with
-- "permission denied" before Row Level Security is even evaluated.
-- RLS (20261124000002_rls.sql) still decides which rows each role can see.

-- Server code (service role) manages everything, including integration_secrets.
grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on all tables in schema public to service_role;

-- Anonymous visitors: read-only on public content (RLS limits to published/visible rows).
grant select on public.posts, public.mission_reports, public.team_members,
  public.partners, public.map_locations, public.site_settings to anon;

-- Signed-in staff: content management (RLS limits to active staff/admins).
grant select, insert, update, delete on public.posts, public.mission_reports,
  public.team_members, public.partners, public.map_locations, public.media_assets to authenticated;
grant select, update on public.profiles to authenticated;
grant select, update, delete on public.contact_messages to authenticated;
grant select on public.newsletter_signups to authenticated;
grant select, insert, update on public.site_settings to authenticated;
-- integration_secrets: no grants for anon/authenticated on purpose.

grant execute on function public.is_staff(), public.is_admin() to anon, authenticated, service_role;
