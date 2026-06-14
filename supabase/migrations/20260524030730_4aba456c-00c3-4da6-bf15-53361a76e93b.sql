-- Deny direct INSERT/UPDATE/DELETE on pixel-images bucket from anon/authenticated.
-- Uploads happen exclusively via the uploadPixelImage server function using the service role,
-- which bypasses RLS. Public read continues to work via the bucket's public flag.

DROP POLICY IF EXISTS "pixel_images_no_insert" ON storage.objects;
DROP POLICY IF EXISTS "pixel_images_no_update" ON storage.objects;
DROP POLICY IF EXISTS "pixel_images_no_delete" ON storage.objects;

CREATE POLICY "pixel_images_no_insert"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id <> 'pixel-images');

CREATE POLICY "pixel_images_no_update"
ON storage.objects
FOR UPDATE
TO anon, authenticated
USING (bucket_id <> 'pixel-images')
WITH CHECK (bucket_id <> 'pixel-images');

CREATE POLICY "pixel_images_no_delete"
ON storage.objects
FOR DELETE
TO anon, authenticated
USING (bucket_id <> 'pixel-images');
