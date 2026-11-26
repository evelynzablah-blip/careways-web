-- RLS smoke tests. Run against a NON-production database after the
-- migrations, e.g.:  psql "$DATABASE_URL" -f supabase/tests/rls.sql
-- Everything runs in a transaction that is rolled back.

begin;

-- Fixtures (as the table owner, bypassing RLS)
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'admin@test.local'),
  ('00000000-0000-0000-0000-00000000000e', 'editor@test.local'),
  ('00000000-0000-0000-0000-00000000000f', 'inactive@test.local');
update public.profiles set role = 'admin', active = true where id = '00000000-0000-0000-0000-00000000000a';
update public.profiles set role = 'editor', active = true where id = '00000000-0000-0000-0000-00000000000e';
-- the third profile stays inactive (default)

insert into public.posts (slug, title_en, status) values ('draft-post', 'Draft', 'draft'), ('live-post', 'Live', 'published');
insert into public.contact_messages (name, email, reason, message) values ('A', 'a@test.local', 'general', 'Hello there');

create or replace function pg_temp.as_user(uid uuid) returns void language plpgsql as $$
begin
  perform set_config('role', 'authenticated', true);
  perform set_config('request.jwt.claims', json_build_object('sub', uid, 'role', 'authenticated')::text, true);
end $$;

-- 1. Anonymous visitors see only published posts
set local role anon;
do $$ begin
  assert (select count(*) from public.posts) = 1, 'anon should see 1 published post';
  assert (select count(*) from public.contact_messages) = 0, 'anon must not read contact messages';
end $$;
reset role;

-- 2. Active editor sees drafts, cannot read contact messages, cannot delete posts
select pg_temp.as_user('00000000-0000-0000-0000-00000000000e');
do $$ begin
  assert (select count(*) from public.posts) = 2, 'editor should see drafts';
  assert (select count(*) from public.contact_messages) = 0, 'editor must not read contact messages';
end $$;
delete from public.posts where slug = 'draft-post';
reset role;
do $$ begin
  assert (select count(*) from public.posts where slug = 'draft-post') = 1, 'editor must not delete posts';
end $$;

-- 3. Inactive account behaves like anon for drafts and cannot write
select pg_temp.as_user('00000000-0000-0000-0000-00000000000f');
do $$ begin
  assert (select count(*) from public.posts) = 1, 'inactive user must not see drafts';
end $$;
do $$ begin
  begin
    insert into public.posts (slug, title_en) values ('sneaky', 'Nope');
    raise exception 'inactive user insert should have failed';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

-- 4. Editor cannot promote themselves
select pg_temp.as_user('00000000-0000-0000-0000-00000000000e');
update public.profiles set role = 'admin' where id = '00000000-0000-0000-0000-00000000000e';
reset role;
do $$ begin
  assert (select role from public.profiles where id = '00000000-0000-0000-0000-00000000000e') = 'editor', 'editor must not self-promote';
end $$;

-- 5. Admin reads contact messages and the private secrets table stays closed
select pg_temp.as_user('00000000-0000-0000-0000-00000000000a');
do $$ begin
  assert (select count(*) from public.contact_messages) = 1, 'admin should read contact messages';
  assert (select count(*) from public.integration_secrets) = 0, 'secrets must be invisible to API users';
end $$;
reset role;

rollback;
\echo 'RLS tests passed'
