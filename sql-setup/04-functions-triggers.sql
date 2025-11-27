-- ============================================
-- STEP 4: DATABASE FUNCTIONS & TRIGGERS
-- ============================================
-- Functions and triggers automate common tasks.
-- We'll create a function to auto-update timestamps.
--
-- Learn more: https://supabase.com/docs/guides/database/functions
-- ============================================

-- ============================================
-- FUNCTION: Auto-update the updated_at timestamp
-- ============================================
-- This function runs whenever a row is updated
-- It automatically sets updated_at to the current time

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Set the updated_at column to current time
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ============================================
-- TRIGGER: Apply the function to notes table
-- ============================================
-- This trigger calls our function before every UPDATE

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.notes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- BONUS FUNCTION: Get user's note count
-- ============================================
-- This is an example of a custom query function
-- You can call this from your app: supabase.rpc('get_note_count')

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

-- ============================================
-- BONUS FUNCTION: Search notes by content
-- ============================================
-- Full-text search example
-- Call with: supabase.rpc('search_notes', { search_term: 'supabase' })

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
-- UNDERSTANDING FUNCTIONS & TRIGGERS
-- ============================================
--
-- FUNCTIONS:
-- - Reusable code blocks in PostgreSQL
-- - Can accept parameters and return values
-- - Can be called from your app with supabase.rpc()
-- - SECURITY DEFINER runs with function owner's permissions
--
-- TRIGGERS:
-- - Automatically run functions on events
-- - BEFORE/AFTER INSERT/UPDATE/DELETE
-- - FOR EACH ROW/STATEMENT
-- - Great for automation (timestamps, validation, logging)
--
-- Common Use Cases:
-- 1. Auto-update timestamps (like we just did)
-- 2. Validate data before insert
-- 3. Create related records automatically
-- 4. Send notifications on changes
-- 5. Log audit trails
--
-- Example Trigger Events:
-- - BEFORE INSERT: Validate/transform data before saving
-- - AFTER INSERT: Create related records, send notifications
-- - BEFORE UPDATE: Check permissions, validate changes
-- - AFTER DELETE: Clean up related data, log deletions
--
-- ============================================
-- WHAT JUST HAPPENED?
-- ============================================
-- ✅ Created function to auto-update timestamps
-- ✅ Set up trigger to call function on updates
-- ✅ Added bonus functions for common operations
-- ✅ Now updated_at changes automatically!
--
-- 💡 Try it out:
-- UPDATE notes SET title = 'New Title' WHERE id = 'some-id';
-- The updated_at will change automatically!
--
-- Next: Enable realtime features (05-realtime-setup.sql)
-- ============================================
