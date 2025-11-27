-- ============================================
-- BONUS: ADVANCED SQL EXAMPLES
-- ============================================
-- This file contains additional examples you can explore
-- These are NOT required for the basic setup
-- Use these to learn more advanced PostgreSQL features
--
-- ⚠️  These are educational examples - run them in a test environment
-- ============================================

-- ============================================
-- EXAMPLE 1: Soft Deletes
-- ============================================
-- Instead of permanently deleting data, mark it as deleted
-- This lets you recover "deleted" items later

-- Add a deleted_at column to notes
-- ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Create a view that only shows non-deleted notes
-- CREATE OR REPLACE VIEW public.active_notes AS
-- SELECT * FROM public.notes WHERE deleted_at IS NULL;

-- Function to "soft delete" a note
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

-- ============================================
-- EXAMPLE 2: Full-Text Search with tsvector
-- ============================================
-- PostgreSQL has powerful full-text search built-in

-- Add a search vector column
-- ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create an index for fast searching
-- CREATE INDEX IF NOT EXISTS idx_notes_search ON public.notes USING GIN(search_vector);

-- Trigger to auto-update search vector
-- CREATE OR REPLACE FUNCTION public.notes_search_trigger()
-- RETURNS TRIGGER
-- LANGUAGE plpgsql
-- AS $$
-- BEGIN
--   NEW.search_vector := 
--     setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
--     setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'B');
--   RETURN NEW;
-- END;
-- $$;

-- CREATE TRIGGER notes_search_update
--   BEFORE INSERT OR UPDATE ON public.notes
--   FOR EACH ROW
--   EXECUTE FUNCTION public.notes_search_trigger();

-- Function to search notes
-- CREATE OR REPLACE FUNCTION public.search_notes_full_text(query TEXT)
-- RETURNS SETOF public.notes
-- LANGUAGE plpgsql
-- AS $$
-- BEGIN
--   RETURN QUERY
--   SELECT *
--   FROM public.notes
--   WHERE 
--     user_id = auth.uid() AND
--     search_vector @@ plainto_tsquery('english', query)
--   ORDER BY ts_rank(search_vector, plainto_tsquery('english', query)) DESC;
-- END;
-- $$;

-- ============================================
-- EXAMPLE 3: JSON Data & JSONB Operations
-- ============================================
-- PostgreSQL is great at handling JSON data

-- Add a tags column to store array of tags
-- ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Add a metadata column for flexible JSON data
-- ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Query notes by tag
-- SELECT * FROM notes WHERE 'important' = ANY(tags);

-- Query notes by JSON property
-- SELECT * FROM notes WHERE metadata->>'category' = 'work';

-- ============================================
-- EXAMPLE 4: Computed Columns & Views
-- ============================================
-- Create a view that adds computed data

-- CREATE OR REPLACE VIEW public.notes_with_stats AS
-- SELECT 
--   n.*,
--   LENGTH(n.content) as content_length,
--   CASE 
--     WHEN LENGTH(n.content) < 100 THEN 'short'
--     WHEN LENGTH(n.content) < 500 THEN 'medium'
--     ELSE 'long'
--   END as content_size,
--   EXTRACT(EPOCH FROM (NOW() - n.created_at)) / 86400 as age_in_days
-- FROM public.notes n;

-- ============================================
-- EXAMPLE 5: Materialized Views for Performance
-- ============================================
-- Materialized views store query results for fast access

-- CREATE MATERIALIZED VIEW public.note_statistics AS
-- SELECT 
--   user_id,
--   COUNT(*) as total_notes,
--   AVG(LENGTH(content)) as avg_content_length,
--   MAX(created_at) as last_note_created
-- FROM public.notes
-- GROUP BY user_id;

-- Create index on materialized view
-- CREATE INDEX idx_note_stats_user ON public.note_statistics(user_id);

-- Refresh the view to update statistics
-- REFRESH MATERIALIZED VIEW public.note_statistics;

-- ============================================
-- EXAMPLE 6: Row-Level Security with Roles
-- ============================================
-- More complex RLS with user roles

-- Create a roles table
-- CREATE TABLE IF NOT EXISTS public.user_roles (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id UUID NOT NULL REFERENCES auth.users(id),
--   role TEXT NOT NULL CHECK (role IN ('user', 'moderator', 'admin')),
--   UNIQUE(user_id, role)
-- );

-- Function to check if user has a role
-- CREATE OR REPLACE FUNCTION public.has_role(check_role TEXT)
-- RETURNS BOOLEAN
-- LANGUAGE plpgsql
-- SECURITY DEFINER
-- AS $$
-- BEGIN
--   RETURN EXISTS (
--     SELECT 1 FROM public.user_roles
--     WHERE user_id = auth.uid() AND role = check_role
--   );
-- END;
-- $$;

-- Policy that allows admins to see all notes
-- CREATE POLICY "Admins can view all notes"
-- ON public.notes
-- FOR SELECT
-- TO authenticated
-- USING (public.has_role('admin') OR auth.uid() = user_id);

-- ============================================
-- EXAMPLE 7: Audit Logging
-- ============================================
-- Track all changes to important tables

-- CREATE TABLE IF NOT EXISTS public.audit_log (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   table_name TEXT NOT NULL,
--   record_id UUID NOT NULL,
--   action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
--   old_data JSONB,
--   new_data JSONB,
--   user_id UUID REFERENCES auth.users(id),
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- Audit trigger function
-- CREATE OR REPLACE FUNCTION public.audit_trigger()
-- RETURNS TRIGGER
-- LANGUAGE plpgsql
-- SECURITY DEFINER
-- AS $$
-- BEGIN
--   IF (TG_OP = 'DELETE') THEN
--     INSERT INTO public.audit_log (table_name, record_id, action, old_data, user_id)
--     VALUES (TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD), auth.uid());
--     RETURN OLD;
--   ELSIF (TG_OP = 'UPDATE') THEN
--     INSERT INTO public.audit_log (table_name, record_id, action, old_data, new_data, user_id)
--     VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD), row_to_json(NEW), auth.uid());
--     RETURN NEW;
--   ELSIF (TG_OP = 'INSERT') THEN
--     INSERT INTO public.audit_log (table_name, record_id, action, new_data, user_id)
--     VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(NEW), auth.uid());
--     RETURN NEW;
--   END IF;
-- END;
-- $$;

-- Add audit trigger to notes table
-- CREATE TRIGGER audit_notes_changes
--   AFTER INSERT OR UPDATE OR DELETE ON public.notes
--   FOR EACH ROW
--   EXECUTE FUNCTION public.audit_trigger();

-- ============================================
-- EXAMPLE 8: Database Constraints
-- ============================================
-- Add data validation at database level

-- Ensure title is not empty
-- ALTER TABLE public.notes ADD CONSTRAINT title_not_empty 
--   CHECK (LENGTH(TRIM(title)) > 0);

-- Ensure content is not too long
-- ALTER TABLE public.notes ADD CONSTRAINT content_max_length
--   CHECK (LENGTH(content) <= 10000);

-- Ensure created_at is not in the future
-- ALTER TABLE public.notes ADD CONSTRAINT created_at_not_future
--   CHECK (created_at <= NOW());

-- ============================================
-- EXAMPLE 9: Partitioning for Large Tables
-- ============================================
-- Split large tables for better performance

-- Create partitioned table by date
-- CREATE TABLE public.notes_partitioned (
--   id UUID DEFAULT gen_random_uuid(),
--   user_id UUID NOT NULL,
--   title TEXT NOT NULL,
--   content TEXT,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
-- ) PARTITION BY RANGE (created_at);

-- Create partitions for each month
-- CREATE TABLE public.notes_2024_01 PARTITION OF public.notes_partitioned
--   FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- CREATE TABLE public.notes_2024_02 PARTITION OF public.notes_partitioned
--   FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- ============================================
-- EXAMPLE 10: Recursive Queries (Common Table Expressions)
-- ============================================
-- Handle hierarchical data like comments, folders, etc.

-- Example: Create a comments table with parent-child relationships
-- CREATE TABLE IF NOT EXISTS public.comments (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   note_id UUID REFERENCES public.notes(id),
--   parent_id UUID REFERENCES public.comments(id),
--   user_id UUID NOT NULL REFERENCES auth.users(id),
--   content TEXT NOT NULL,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- Recursive query to get all replies to a comment
-- WITH RECURSIVE comment_tree AS (
--   -- Base case: top-level comment
--   SELECT id, parent_id, content, 0 as depth
--   FROM public.comments
--   WHERE id = 'some-comment-id'
--   
--   UNION ALL
--   
--   -- Recursive case: replies to replies
--   SELECT c.id, c.parent_id, c.content, ct.depth + 1
--   FROM public.comments c
--   INNER JOIN comment_tree ct ON c.parent_id = ct.id
-- )
-- SELECT * FROM comment_tree;

-- ============================================
-- MORE LEARNING RESOURCES
-- ============================================
--
-- PostgreSQL Documentation:
-- https://www.postgresql.org/docs/current/
--
-- Supabase Database Guide:
-- https://supabase.com/docs/guides/database/overview
--
-- PostgreSQL Performance Tips:
-- https://wiki.postgresql.org/wiki/Performance_Optimization
--
-- SQL Indexing Tutorial:
-- https://use-the-index-luke.com/
--
-- ============================================
-- Keep exploring and happy learning! 🎓
-- ============================================
