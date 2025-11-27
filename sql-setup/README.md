# Supabase Manual Setup Guide

This folder contains all SQL scripts to set up your Supabase database manually. Follow these steps to learn and implement each feature.

## 📚 Prerequisites

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to the **SQL Editor** (left sidebar)
3. You'll run each SQL file in order

## 🎯 Setup Order

Follow this exact order to set up your Supabase project:

### Step 1: Storage Setup
**File:** `01-storage-setup.sql`

This creates a storage bucket for file uploads and sets up security policies.

**What you'll learn:**
- How to create storage buckets
- Row Level Security (RLS) for storage
- Public vs private buckets

**Docs:** https://supabase.com/docs/guides/storage

### Step 2: Database Tables
**File:** `02-create-tables.sql`

Creates sample tables to demonstrate database features.

**What you'll learn:**
- Creating tables with proper data types
- Primary keys and foreign keys
- UUID generation
- Timestamps

**Docs:** https://supabase.com/docs/guides/database/tables

### Step 3: Row Level Security (RLS)
**File:** `03-rls-policies.sql`

Sets up security policies to control who can access what data.

**What you'll learn:**
- Enabling RLS on tables
- Creating policies for SELECT, INSERT, UPDATE, DELETE
- Using `auth.uid()` to identify users
- Public vs authenticated access

**Docs:** https://supabase.com/docs/guides/auth/row-level-security

### Step 4: Database Functions & Triggers
**File:** `04-functions-triggers.sql`

Creates helper functions and automated triggers.

**What you'll learn:**
- Creating PostgreSQL functions
- Setting up triggers for auto-updates
- Security definer functions
- Automatic timestamp updates

**Docs:** https://supabase.com/docs/guides/database/functions

### Step 5: Realtime Setup
**File:** `05-realtime-setup.sql`

Enables real-time subscriptions for tables.

**What you'll learn:**
- Enabling realtime on tables
- REPLICA IDENTITY for updates
- Publications for realtime

**Docs:** https://supabase.com/docs/guides/realtime

## 🚀 How to Run SQL Scripts

1. **Open SQL Editor** in your Supabase dashboard
2. **Create a new query** (click "New query")
3. **Copy the entire content** of a SQL file
4. **Paste it** into the SQL editor
5. **Click "Run"** (or press Cmd/Ctrl + Enter)
6. **Check for success** - you should see "Success. No rows returned" or similar

### ⚠️ Important Notes

- Run scripts **in order** (01, 02, 03, etc.)
- If you get an error, read it carefully - it often tells you exactly what's wrong
- You can run scripts multiple times - they're designed to be idempotent (won't break if run twice)
- Some scripts use `IF NOT EXISTS` or `ON CONFLICT DO NOTHING` to prevent duplicates

## 🔧 Troubleshooting

### "relation already exists"
This means the table/bucket already exists. You can:
- Skip this script (it's already set up)
- OR use `DROP TABLE table_name CASCADE;` to remove it first (⚠️ this deletes all data!)

### "permission denied"
Make sure you're using the SQL Editor in your Supabase dashboard, not a client connection.

### "function does not exist"
Run the functions script (04-functions-triggers.sql) first.

## 📖 Learning Resources

- **Supabase Docs:** https://supabase.com/docs
- **PostgreSQL Tutorial:** https://www.postgresql.org/docs/current/tutorial.html
- **Row Level Security:** https://supabase.com/docs/guides/auth/row-level-security
- **Storage Guide:** https://supabase.com/docs/guides/storage
- **Realtime Guide:** https://supabase.com/docs/guides/realtime

## 🎓 What Each Feature Does

### Authentication
- Handled automatically by Supabase Auth
- Already configured in your project
- Users can sign up with email/password
- Docs: https://supabase.com/docs/guides/auth

### Storage
- Store files like images, documents, etc.
- Buckets are like folders
- RLS policies control access
- Files get URLs you can use in your app

### Database
- PostgreSQL database
- Tables store your data
- Relations link tables together
- RLS keeps data secure

### Edge Functions
- Serverless backend code
- Written in TypeScript/Deno
- Deployed at the edge (fast globally)
- Located in `supabase/functions/` folder

### Realtime
- Listen to database changes live
- Broadcast messages between clients
- WebSocket connections
- Great for chat, collaboration, live updates

## 🎯 Next Steps After Setup

1. **Test Authentication** - Try signing up on your app
2. **Upload a File** - Test the storage feature
3. **Create Data** - Add records to your tables
4. **Watch Realtime** - Open two browser tabs and see live updates
5. **Call Edge Function** - Test the hello-world function

## 💡 Pro Tips

- Always enable RLS on tables with user data
- Use `auth.uid()` to link data to users
- Test policies with different user accounts
- Check the Supabase logs for debugging
- Use the Table Editor to browse data visually

Good luck learning Supabase! 🚀
