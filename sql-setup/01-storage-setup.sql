-- ============================================
-- STEP 1: STORAGE SETUP
-- ============================================

-- Create a public storage bucket called 'demo-files'
INSERT INTO storage.buckets (id, name, public)
VALUES ('demo-files', 'demo-files', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist (safe to run multiple times)
DROP POLICY IF EXISTS "Public file access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete files" ON storage.objects;

-- Policy 1: Allow anyone to view files (read access)
CREATE POLICY "Public file access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'demo-files');

-- Policy 2: Only authenticated users can upload files
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'demo-files');

-- Policy 3: Users can update their own files
CREATE POLICY "Authenticated users can update files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'demo-files');

-- Policy 4: Users can delete files
CREATE POLICY "Authenticated users can delete files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'demo-files');

-- ============================================
-- WHAT JUST HAPPENED?
-- ============================================
-- ✅ Created a bucket called 'demo-files'
-- ✅ Made it public (files are viewable by anyone)
-- ✅ Set up policies so only logged-in users can upload/modify
-- ✅ Anyone can view files, but only auth users can change them
--
-- Next: Create database tables (02-create-tables.sql)
-- ============================================
