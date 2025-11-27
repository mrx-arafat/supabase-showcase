-- ============================================
-- STEP 1: STORAGE SETUP
-- ============================================
-- This file sets up a storage bucket for file uploads
-- and configures security policies for accessing files.
--
-- Learn more: https://supabase.com/docs/guides/storage
-- ============================================

-- Create a public storage bucket called 'demo-files'
-- Public buckets allow anyone to view files, but you can still
-- control who can upload/delete with policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('demo-files', 'demo-files', true)
ON CONFLICT (id) DO NOTHING;

-- Policy 1: Allow anyone to view files (read access)
-- This is safe because the bucket is public
CREATE POLICY IF NOT EXISTS "Public file access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'demo-files');

-- Policy 2: Only authenticated users can upload files
-- This prevents anonymous users from filling up your storage
CREATE POLICY IF NOT EXISTS "Authenticated users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'demo-files');

-- Policy 3: Users can update their own files
-- Though typically you'd add user_id checks here for production
CREATE POLICY IF NOT EXISTS "Authenticated users can update files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'demo-files');

-- Policy 4: Users can delete files
-- Again, in production you'd restrict to file owner
CREATE POLICY IF NOT EXISTS "Authenticated users can delete files"
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
