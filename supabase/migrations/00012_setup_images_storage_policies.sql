
-- Allow authenticated users to upload to images bucket
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Allow public read access to images bucket
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'images');

-- Allow authenticated users to delete their own uploads
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images');
