-- ============================================
-- STEP 3: ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- RLS is Supabase's secret weapon for security!
-- It lets you control who can see and modify which rows.
--
-- Learn more: https://supabase.com/docs/guides/auth/row-level-security
-- ============================================

-- First, ENABLE RLS on the notes table
-- Without this, anyone can access any note!
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICY 1: Users can view their own notes
-- ============================================
-- This policy allows SELECT operations
-- Only returns rows where user_id matches the logged-in user
CREATE POLICY "Users can view their own notes"
ON public.notes
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- POLICY 2: Users can create their own notes
-- ============================================
-- This policy allows INSERT operations
-- Ensures the user_id in new notes matches the logged-in user
CREATE POLICY "Users can create their own notes"
ON public.notes
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- POLICY 3: Users can update their own notes
-- ============================================
-- This policy allows UPDATE operations
-- Only allows updating notes that belong to the user
CREATE POLICY "Users can update their own notes"
ON public.notes
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- POLICY 4: Users can delete their own notes
-- ============================================
-- This policy allows DELETE operations
-- Only allows deleting notes that belong to the user
CREATE POLICY "Users can delete their own notes"
ON public.notes
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- UNDERSTANDING RLS POLICIES
-- ============================================
-- 
-- Policy Components:
-- - FOR: What operation (SELECT, INSERT, UPDATE, DELETE, ALL)
-- - TO: Who (public, authenticated, specific role)
-- - USING: Which rows (for SELECT, UPDATE, DELETE)
-- - WITH CHECK: Validation (for INSERT, UPDATE)
--
-- Common Patterns:
-- - auth.uid(): Gets the current user's ID
-- - TO authenticated: Only logged-in users
-- - TO public: Everyone, including anonymous
--
-- Examples:
-- 1. Public read, auth write:
--    FOR SELECT TO public USING (true)
--    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id)
--
-- 2. Admin only:
--    USING (EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid()))
--
-- 3. Owner or public:
--    USING (is_public = true OR auth.uid() = user_id)
--
-- ============================================
-- WHAT JUST HAPPENED?
-- ============================================
-- ✅ Enabled RLS on the notes table
-- ✅ Created policies for SELECT, INSERT, UPDATE, DELETE
-- ✅ Each user can only access their own notes
-- ✅ The database now enforces security automatically!
--
-- 🔒 Security is now ENFORCED at the database level
-- Even if someone hacks your frontend, they can't access other users' data
--
-- Next: Create helper functions (04-functions-triggers.sql)
-- ============================================
