
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('pixel-images', 'pixel-images', true, 2097152, array['image/png','image/jpeg','image/webp','image/gif'])
on conflict (id) do update set public = true, file_size_limit = 2097152, allowed_mime_types = array['image/png','image/jpeg','image/webp','image/gif'];

create policy "Public read pixel-images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'pixel-images');

create policy "Anyone can upload pixel-images"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'pixel-images');
