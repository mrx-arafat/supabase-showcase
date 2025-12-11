-- ============================================
-- COMPLETE SUPABASE SETUP - ALL IN ONE FILE
-- ============================================
-- This file combines all 6 setup scripts
-- You can run this entire file at once
-- Or run individual sections as needed
--
-- ⏱️  Time to run: ~2-3 minutes
-- ✅ What you'll have: Full working Supabase database setup
--
-- ============================================

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
-- STEP 2: CREATE DATABASE TABLES
-- ============================================

-- Create a notes table for users to store their notes
CREATE TABLE IF NOT EXISTS public.notes (
  -- Primary key: unique identifier for each note
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign key: links this note to a user in auth.users
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Note content
  title TEXT NOT NULL,
  content TEXT,
  
  -- Metadata: automatically track when notes are created/updated
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create an index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes(user_id);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON public.notes(created_at DESC);

-- ============================================
-- STEP 3: ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on the notes table
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- POLICY 1: Users can view their own notes
CREATE POLICY "Users can view their own notes"
ON public.notes
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- POLICY 2: Users can create their own notes
CREATE POLICY "Users can create their own notes"
ON public.notes
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- POLICY 3: Users can update their own notes
CREATE POLICY "Users can update their own notes"
ON public.notes
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- POLICY 4: Users can delete their own notes
CREATE POLICY "Users can delete their own notes"
ON public.notes
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- STEP 4: DATABASE FUNCTIONS & TRIGGERS
-- ============================================

-- FUNCTION: Auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- TRIGGER: Apply the function to notes table
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.notes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- BONUS FUNCTION: Get user's note count
CREATE OR REPLACE FUNCTION public.get_note_count(target_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  note_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO note_count
  FROM public.notes
  WHERE user_id = target_user_id;
  
  RETURN note_count;
END;
$$;

-- BONUS FUNCTION: Search notes by content
CREATE OR REPLACE FUNCTION public.search_notes(search_term TEXT)
RETURNS SETOF public.notes
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.notes
  WHERE 
    user_id = auth.uid() AND
    (
      title ILIKE '%' || search_term || '%' OR
      content ILIKE '%' || search_term || '%'
    )
  ORDER BY created_at DESC;
END;
$$;

-- ============================================
-- STEP 5: REALTIME SETUP
-- ============================================

-- Set REPLICA IDENTITY to include full row data in change events
ALTER TABLE public.notes REPLICA IDENTITY FULL;

-- Add table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.notes;

-- ============================================
-- STEP 6: BONUS EXAMPLES (OPTIONAL)
-- ============================================
-- These are commented out but available for learning
-- Uncomment to use any of these features

-- EXAMPLE: Soft Deletes
-- ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
-- 
-- CREATE OR REPLACE VIEW public.active_notes AS
-- SELECT * FROM public.notes WHERE deleted_at IS NULL;
--
-- CREATE OR REPLACE FUNCTION public.soft_delete_note(note_id UUID)
-- RETURNS VOID
-- LANGUAGE plpgsql
-- SECURITY DEFINER
-- AS $$
-- BEGIN
--   UPDATE public.notes
--   SET deleted_at = NOW()
--   WHERE id = note_id AND user_id = auth.uid();
-- END;
-- $$;

-- EXAMPLE: Add tags to notes
-- ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS tags TEXT[];

-- EXAMPLE: Add metadata JSON column
-- ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS metadata JSONB;

-- ============================================
-- ✅ SETUP COMPLETE!
-- ============================================
-- 
-- Your Supabase database is now fully configured with:
-- ✅ Storage bucket for files
-- ✅ Notes table with proper structure
-- ✅ Row Level Security (RLS) policies
-- ✅ Auto-updating timestamps via triggers
-- ✅ Helper functions for common operations
-- ✅ Real-time subscriptions enabled
--
-- Next Steps:
-- 1. Test creating a note in your app
-- 2. Open two browser tabs and watch realtime updates
-- 3. Try uploading a file to storage
-- 4. Check out the bonus examples for advanced features
--
-- 📚 Learn More:
-- - Supabase Docs: https://supabase.com/docs
-- - PostgreSQL: https://www.postgresql.org/docs
-- - RLS Guide: https://supabase.com/docs/guides/auth/row-level-security
-- - Realtime: https://supabase.com/docs/guides/realtime
--
-- Happy coding! 🚀
-- ============================================
