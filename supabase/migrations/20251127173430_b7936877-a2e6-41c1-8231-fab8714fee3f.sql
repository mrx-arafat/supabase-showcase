-- Create storage bucket for demo files
INSERT INTO storage.buckets (id, name, public)
VALUES ('demo-files', 'demo-files', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for public file access
CREATE POLICY "Public file access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'demo-files');

-- Create policy for authenticated uploads
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'demo-files');

-- Create policy for authenticated updates
CREATE POLICY "Authenticated users can update their files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'demo-files');

-- Create policy for authenticated deletes
CREATE POLICY "Authenticated users can delete their files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'demo-files');