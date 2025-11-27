-- ============================================
-- STEP 2: CREATE DATABASE TABLES
-- ============================================
-- This file creates sample tables to demonstrate database features.
-- We'll create a 'notes' table as an example.
--
-- Learn more: https://supabase.com/docs/guides/database/tables
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
-- This makes "SELECT * FROM notes WHERE user_id = ?" super fast
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes(user_id);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON public.notes(created_at DESC);

-- ============================================
-- OPTIONAL: Sample data for testing
-- ============================================
-- Uncomment these lines if you want some test data
-- You'll need to replace 'YOUR_USER_ID' with an actual user ID
-- You can get this by signing up and checking the auth.users table

-- INSERT INTO public.notes (user_id, title, content) VALUES
-- ('YOUR_USER_ID', 'My First Note', 'This is a test note about Supabase!'),
-- ('YOUR_USER_ID', 'Learning SQL', 'PostgreSQL is powerful and easy to learn.');

-- ============================================
-- WHAT JUST HAPPENED?
-- ============================================
-- ✅ Created a 'notes' table with proper structure
-- ✅ Added foreign key to link notes to users
-- ✅ Set up automatic UUID generation
-- ✅ Added timestamps for tracking changes
-- ✅ Created indexes for better performance
--
-- ⚠️  IMPORTANT: This table is NOT secure yet!
-- Anyone can read/write any note because we haven't set up RLS.
-- Next: Set up Row Level Security (03-rls-policies.sql)
-- ============================================
