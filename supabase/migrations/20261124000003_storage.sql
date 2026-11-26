-- Storage buckets. Both are public-read (files are served by URL on the site);
-- only active staff can upload, replace or delete.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('media', 'media', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']),
  ('documents', 'documents', true, 52428800, array['application/pdf'])
on conflict (id) do nothing;

create policy "storage: staff list" on storage.objects for select to authenticated
  using (bucket_id in ('media', 'documents') and public.is_staff());

create policy "storage: staff upload" on storage.objects for insert to authenticated
  with check (bucket_id in ('media', 'documents') and public.is_staff());

create policy "storage: staff update" on storage.objects for update to authenticated
  using (bucket_id in ('media', 'documents') and public.is_staff())
  with check (bucket_id in ('media', 'documents') and public.is_staff());

create policy "storage: staff delete" on storage.objects for delete to authenticated
  using (bucket_id in ('media', 'documents') and public.is_staff());
