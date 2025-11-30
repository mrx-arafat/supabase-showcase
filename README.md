# 🚀 Supabase Showcase - Complete Learning Platform

<div align="center">

![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**An interactive, production-ready showcase demonstrating all major Supabase features with live demos, beautiful UI, and comprehensive documentation.**

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Documentation](#-complete-documentation)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Live Demos](#-whats-included)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Supabase Setup](#-supabase-setup-detailed)
- [How It Works](#-how-everything-works)
- [Architecture](#-architecture--data-flow)
- [Real-time Explained](#-understanding-realtime-features)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [FAQ](#-frequently-asked-questions)

---

## 🌟 Overview

This is a **comprehensive, hands-on learning platform** for Supabase - the open-source Firebase alternative. Every feature is implemented with:

- ✅ **Live Interactive Demos** - Try everything directly in your browser
- ✅ **Real-time Updates** - See changes happen instantly across multiple tabs
- ✅ **Beautiful Modern UI** - Built with shadcn/ui and Tailwind CSS
- ✅ **Type-Safe Development** - Full TypeScript with auto-generated database types
- ✅ **Production Patterns** - Industry best practices and security
- ✅ **Complete SQL Scripts** - Ready-to-use database setup scripts
- ✅ **Detailed Documentation** - Learn how everything works

**Perfect For:**

- 🎓 Learning Supabase from scratch
- 💼 Demonstrating capabilities to clients/teams
- 🚀 Starting new Supabase projects
- 🔍 Understanding real-time architecture
- 📚 Reference implementation for best practices

---

## ✨ Features

### 🔐 **1. Authentication System**

Complete user management with:

- ✅ Email/Password sign up and sign in
- ✅ Session management with auto-refresh
- ✅ Persistent login (survives page reload)
- ✅ User profile display
- ✅ Protected features with RLS
- ✅ Sign out functionality

**What You'll Learn:**

- How to implement Supabase Auth
- Session persistence with localStorage
- Auth state management in React
- JWT token handling

---

### 🗄️ **2. Database Operations**

Full CRUD operations with PostgreSQL:

- ✅ Create notes with title and content
- ✅ Read all user's notes (filtered by RLS)
- ✅ Delete notes securely
- ✅ Real-time synchronization
- ✅ Row Level Security (RLS) policies

**What You'll Learn:**

- PostgreSQL operations via Supabase
- How RLS protects data automatically
- Type-safe database queries
- Real-time database subscriptions

**Database Schema:**

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT,
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

### 📦 **3. File Storage**

Secure file management:

- ✅ File upload with progress
- ✅ Public and private buckets
- ✅ Image preview
- ✅ File listing
- ✅ Delete files
- ✅ Storage policies

**What You'll Learn:**

- Supabase Storage API
- Bucket configuration
- Storage policies and security
- Public URL generation

---

### ⚡ **4. Edge Functions**

Serverless backend functions:

- ✅ Deploy functions to the edge
- ✅ Custom API endpoints
- ✅ Deno runtime
- ✅ CORS configuration
- ✅ Request/response handling

**What You'll Learn:**

- Creating serverless functions
- Deploying to Supabase Edge
- API endpoint design
- Function invocation from frontend

**Example Function:**

```typescript
// supabase/functions/hello-world/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { name } = await req.json();
  return new Response(
    JSON.stringify({ message: `Hello ${name}!` }),
    { headers: { "Content-Type": "application/json" } }
  );
});
```

---

### 🔴 **5. Real-time Chat**

Live messaging system **WITHOUT a database**:

- ✅ Instant message delivery
- ✅ User presence tracking (who's online)
- ✅ Join/leave notifications
- ✅ Message timestamps
- ✅ Email/guest name display
- ✅ Clear chat history
- ✅ Auto-scroll to latest messages

**What You'll Learn:**

- Supabase Broadcast (WebSocket)
- Presence tracking
- Ephemeral messaging (no storage)
- Real-time UI updates

**Key Concept:**

```
Chat uses BROADCAST mode:
- Messages sent via WebSocket
- NOT stored in any database
- Instant delivery to all users
- Messages disappear when tabs close
```

---

### 📊 **6. Database Real-time**

Live database change monitoring:

- ✅ Watch INSERT/UPDATE/DELETE events
- ✅ Real-time notifications
- ✅ Multi-user synchronization
- ✅ Event history
- ✅ Online user counter

**What You'll Learn:**

- Postgres Changes subscriptions
- Database replication
- Real-time event handling
- RLS with real-time

**Key Concept:**

```
Database Real-time uses POSTGRES CHANGES:
- Monitors actual table changes
- Data IS stored in database
- Permanent records
- RLS policies apply to events
```

---

## 🎮 What's Included

| Feature                  | Description              | Database Required       | Data Persistent   |
| ------------------------ | ------------------------ | ----------------------- | ----------------- |
| **Authentication** | User sign up/in/out      | ✅ Yes (auth.users)     | ✅ Yes            |
| **Database CRUD**  | Create/read/delete notes | ✅ Yes (notes table)    | ✅ Yes            |
| **Storage**        | File upload/download     | ✅ Yes (storage bucket) | ✅ Yes            |
| **Edge Functions** | Serverless API calls     | ❌ No                   | N/A               |
| **Real-time Chat** | Live messaging           | ❌ No                   | ❌ No (ephemeral) |
| **DB Real-time**   | Watch database changes   | ✅ Yes (notes table)    | ✅ Yes            |

---

## 🛠️ Tech Stack

### Frontend

- **React 18.3** - UI library with hooks
- **TypeScript 5.5** - Type-safe JavaScript
- **Vite 5.4** - Lightning-fast build tool
- **TailwindCSS 3.4** - Utility-first CSS
- **shadcn/ui** - Beautiful component library
- **Lucide React** - Modern icon library
- **React Query** - Data fetching and caching
- **Sonner** - Toast notifications

### Backend (Supabase)

- **PostgreSQL 15** - Relational database
- **PostgREST** - Automatic REST API
- **GoTrue** - Authentication service
- **Realtime** - WebSocket server
- **Storage** - S3-compatible file storage
- **Edge Functions** - Deno runtime

### Development

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js 18+** installed ([Download](https://nodejs.org/))
- ✅ **npm** or **yarn** package manager
- ✅ **Supabase account** (free tier works!) ([Sign up](https://supabase.com))
- ✅ **Git** installed (optional)

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/mrx-arafat/supabase-showcase.git
cd supabase-showcase
```

Or download as ZIP and extract.

#### 2. Install Dependencies

```bash
npm install
```

This will install:

- React and related libraries
- Supabase client library
- UI components (shadcn/ui)
- Development tools

#### 3. Create Environment File

Create a `.env` file in the root directory:

```bash
touch .env
```

Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
VITE_SUPABASE_PROJECT_ID=your-project-id
```

**Where to find these values:**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_PUBLISHABLE_KEY`
   - From URL, extract project ID → `VITE_SUPABASE_PROJECT_ID`

#### 4. Run Development Server

```bash
npm run dev
```

Open your browser to:

```
http://localhost:5173
```

You should see the Supabase Showcase homepage! 🎉

---

## 🗃️ Supabase Setup (Detailed)

### Step 1: Create Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in:
   - **Name:** Supabase Showcase
   - **Database Password:** (strong password)
   - **Region:** (closest to you)
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup

### Step 2: Run SQL Setup Scripts

Navigate to **SQL Editor** in your Supabase dashboard and run these scripts **in order**:

#### **Script 1: Storage Setup** (`01-storage-setup.sql`)

```sql
-- Create avatars bucket for file storage
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Allow authenticated users to upload files
CREATE POLICY "Users can upload files" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow public read access
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

**What this does:**

- Creates a public storage bucket named "avatars"
- Sets up policies so users can upload/delete their own files
- Allows public read access to all files

---

#### **Script 2: Create Tables** (`02-create-tables.sql`)

```sql
-- Create notes table
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS notes_user_id_idx ON public.notes(user_id);
CREATE INDEX IF NOT EXISTS notes_created_at_idx ON public.notes(created_at DESC);

-- Add comments for documentation
COMMENT ON TABLE public.notes IS 'User notes with real-time capabilities';
COMMENT ON COLUMN public.notes.user_id IS 'Foreign key to auth.users';
```

**What this does:**

- Creates `notes` table with proper schema
- Adds indexes for performance
- Links notes to authenticated users
- Auto-generates IDs and timestamps

---

#### **Script 3: Row Level Security** (`03-rls-policies.sql`)

```sql
-- Enable RLS on notes table
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view only their own notes
CREATE POLICY "Users can view own notes" ON public.notes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert notes for themselves only
CREATE POLICY "Users can insert own notes" ON public.notes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update only their own notes
CREATE POLICY "Users can update own notes" ON public.notes
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete only their own notes
CREATE POLICY "Users can delete own notes" ON public.notes
  FOR DELETE
  USING (auth.uid() = user_id);
```

**What this does:**

- Enables Row Level Security (RLS)
- Creates policies that automatically filter data by user
- Prevents users from accessing other users' notes
- Works automatically - no code changes needed!

**How RLS Works:**

```
User A tries to SELECT * FROM notes:
  → Supabase checks: auth.uid() = user_id
  → Only returns notes where user_id = User A's ID
  → User A CANNOT see User B's notes (even if they try!)
```

---

#### **Script 4: Functions & Triggers** (`04-functions-triggers.sql`)

```sql
-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call function on update
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.notes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
```

**What this does:**

- Automatically updates `updated_at` field on every note update
- No manual timestamp management needed

---

#### **Script 5: Real-time Setup** (`05-realtime-setup.sql`)

```sql
-- Enable real-time for notes table
ALTER TABLE public.notes REPLICA IDENTITY FULL;

-- Add table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.notes;
```

**What this does:**

- Enables real-time subscriptions for the `notes` table
- Allows frontend to listen for INSERT/UPDATE/DELETE events
- `REPLICA IDENTITY FULL` ensures you get complete row data in events

**Real-time Flow:**

```
User creates note → INSERT into notes table
                  ↓
              Real-time event triggered
                  ↓
         All subscribed clients notified
                  ↓
         UI updates automatically
```

---

#### **Script 6: Bonus Examples** (Optional)

Contains advanced queries and patterns for learning.

---

### Step 3: Verify Setup

Run this query to verify everything is set up:

```sql
-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'notes'
);

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'notes';

-- Check realtime publication
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
```

Expected results:

- ✅ Table exists: `true`
- ✅ RLS enabled: `true`
- ✅ Table in publication: `notes`

---

## 🔍 How Everything Works

### 1. Supabase Client Initialization

**File:** `src/integrations/supabase/client.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Read environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Create and export Supabase client
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_KEY, 
  {
    auth: {
      storage: localStorage,        // Store session in browser
      persistSession: true,          // Keep user logged in
      autoRefreshToken: true,        // Auto-refresh when expired
    }
  }
);
```

**What happens:**

1. Client is created once when app loads
2. API credentials are read from environment variables
3. Authentication is configured to persist sessions
4. Client is used throughout the app (singleton pattern)

**Benefits:**

- ✅ One client instance for the entire app
- ✅ Sessions persist across page reloads
- ✅ Tokens refresh automatically
- ✅ Type-safe with auto-generated types

---

### 2. Type-Safe Database Operations

**File:** `src/integrations/supabase/types.ts`

Auto-generated TypeScript types from your database schema:

```typescript
export type Database = {
  public: {
    Tables: {
      notes: {
        Row: {              // Type for SELECT queries
          id: string
          title: string
          content: string | null
          user_id: string
          created_at: string
        }
        Insert: {           // Type for INSERT operations
          id?: string
          title: string
          content?: string | null
          user_id: string
        }
        Update: {           // Type for UPDATE operations
          title?: string
          content?: string | null
        }
      }
    }
  }
}
```

**How to generate:**

```bash
npx supabase gen types typescript --project-id your-project-id > src/integrations/supabase/types.ts
```

**Benefits:**

- ✅ Full autocomplete in VS Code
- ✅ Compile-time error checking
- ✅ Refactoring safety
- ✅ No typos in column names

---

### 3. Authentication Flow

**File:** `src/components/AuthDemo.tsx`

```typescript
const handleSignUp = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });
  
  if (error) {
    toast.error(error.message);
  } else {
    toast.success("Check your email to confirm!");
  }
};

const handleSignIn = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  
  if (error) {
    toast.error(error.message);
  } else {
    toast.success("Welcome back!");
  }
};

// Listen for auth state changes
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      setUser(session?.user ?? null);
    
      // event can be: SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, etc.
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user);
      }
    }
  );

  return () => subscription.unsubscribe();
}, []);
```

**Authentication Flow Diagram:**

```
┌─────────────────────────────────────────────────────────┐
│ 1. User enters email/password                           │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│ 2. Frontend calls supabase.auth.signInWithPassword()   │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│ 3. Supabase validates credentials                       │
│    - Checks password hash                               │
│    - Verifies email is confirmed                        │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Supabase returns JWT token + user data               │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Token stored in localStorage                         │
│    - Persists across page reloads                       │
│    - Automatically included in all requests             │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│ 6. User is authenticated                                │
│    - Can access protected features                      │
│    - RLS policies automatically apply                   │
└─────────────────────────────────────────────────────────┘
```

---

### 4. Database Operations with RLS

**File:** `src/components/DatabaseDemo.tsx`

```typescript
// CREATE - Insert new note
const createNote = async () => {
  const { error } = await supabase
    .from('notes')
    .insert({ 
      title: title,
      content: content,
      user_id: user.id  // Must match authenticated user
    });
  
  if (!error) {
    toast.success("Note created!");
    loadNotes();
  }
};

// READ - Get all notes (RLS auto-filters by user)
const loadNotes = async () => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (!error) {
    setNotes(data || []);
    // Only returns current user's notes!
  }
};

// DELETE - Remove note
const deleteNote = async (id: string) => {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id);  // RLS ensures user owns this note
  
  if (!error) {
    toast.success("Note deleted!");
    loadNotes();
  }
};
```

**How RLS Protects Your Data:**

```sql
-- This policy runs AUTOMATICALLY on every SELECT
CREATE POLICY "Users can view own notes" ON notes
  FOR SELECT
  USING (auth.uid() = user_id);
```

**Example:**

```typescript
// User A (id: '123') runs:
const { data } = await supabase.from('notes').select('*');

// Supabase automatically converts this to:
SELECT * FROM notes WHERE user_id = '123';

// User A can NEVER see User B's notes!
// Even if they try to hack the query
```

**RLS Benefits:**

- ✅ Automatic data filtering by user
- ✅ No manual WHERE clauses needed
- ✅ Works on INSERT/UPDATE/DELETE too
- ✅ Prevents security vulnerabilities
- ✅ Database-level enforcement

---

### 5. Real-time Chat (Broadcast Mode)

**File:** `src/components/ChatDemo.tsx`

```typescript
// Initialize channel with self-receive enabled
const chatChannel = supabase.channel('public-chat', {
  config: {
    broadcast: {
      self: true,  // Important: Receive your own messages!
    },
  },
});

// Listen for messages
chatChannel
  .on('broadcast', { event: 'chat-message' }, ({ payload }) => {
    const newMessage = {
      id: `${payload.userId}-${payload.timestamp}`,
      text: payload.text,
      userName: payload.userName,
      userEmail: payload.userEmail,
      timestamp: payload.timestamp,
      userId: payload.userId,
    };
  
    // Add to messages array
    setMessages(prev => [...prev, newMessage]);
  
    // Auto-scroll to bottom
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth'
    });
  })
  .subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      console.log('Connected to chat!');
    }
  });

// Send a message
const sendMessage = () => {
  chatChannel.send({
    type: 'broadcast',
    event: 'chat-message',
    payload: {
      text: messageInput,
      userName: currentUser.name,
      userEmail: currentUser.email,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
    },
  });
  
  setMessageInput('');  // Clear input
};

// Track user presence
const presence = supabase.channel('chat-users');

presence
  .on('presence', { event: 'sync' }, () => {
    const state = presence.presenceState();
    const users = Object.values(state).flat();
    setOnlineUsers(users);
  })
  .on('presence', { event: 'join' }, ({ newPresences }) => {
    toast.success(`${newPresences[0].userName} joined! 👋`);
  })
  .on('presence', { event: 'leave' }, ({ leftPresences }) => {
    toast.info(`${leftPresences[0].userName} left`);
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await presence.track({
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
      });
    }
  });
```

**Broadcast Flow Diagram:**

```
┌──────────┐                                    ┌──────────┐
│  Tab 1   │                                    │  Tab 2   │
│          │                                    │          │
│  User    │                                    │  User    │
│  types   │                                    │  sees    │
│ "Hello!" │                                    │ message  │
└────┬─────┘                                    └────▲─────┘
     │                                               │
     │ WebSocket.send()                 WebSocket event
     │                                               │
     │                                               │
     └──────────► SUPABASE ◄───────────────────────┘
                 (Broadcast)
               
    ┌────────────────────────────────────┐
    │ Messages NOT stored in database!   │
    │ Ephemeral - disappear when closed  │
    └────────────────────────────────────┘
```

**Key Concepts:**

- ❌ **No database** - Messages never stored
- ⚡ **WebSocket** - Instant delivery
- 🔄 **Broadcast** - Sent to all connected clients
- 👁️ **Self-receive** - Sender sees their own messages
- 💨 **Ephemeral** - Messages gone when tabs close

---

### 6. Database Real-time (Postgres Changes)

**File:** `src/components/RealtimeDemo.tsx`

```typescript
// Subscribe to database changes
const notesChannel = supabase
  .channel('notes-changes')
  .on(
    'postgres_changes',
    { 
      event: '*',           // Listen to ALL events
      schema: 'public',
      table: 'notes'
    },
    (payload) => {
      const eventType = payload.eventType;  // INSERT, UPDATE, or DELETE
    
      if (eventType === 'INSERT') {
        console.log('New note:', payload.new);
        toast.success(`📝 Note created: "${payload.new.title}"`);
      } 
      else if (eventType === 'UPDATE') {
        console.log('Updated note:', payload.new);
        toast.info(`✏️ Note updated: "${payload.new.title}"`);
      } 
      else if (eventType === 'DELETE') {
        console.log('Deleted note:', payload.old);
        toast.info(`🗑️ Note deleted`);
      }
    
      // Add to events list
      setDbEvents(prev => [
        {
          type: eventType,
          message: `${eventType}: ${payload.new?.title || 'Note'}`,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev
      ].slice(0, 10));  // Keep last 10 events
    }
  )
  .subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      console.log('Listening to database changes');
    }
  });
```

**Postgres Changes Flow:**

```
┌─────────────────────────────────────────────────────────┐
│ 1. User creates note in Database tab                    │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│ 2. INSERT query executed on PostgreSQL                 │
│    INSERT INTO notes (title, content, user_id) ...     │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│ 3. PostgreSQL writes to Write-Ahead Log (WAL)          │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Supabase Realtime server detects WAL change         │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Realtime broadcasts event via WebSocket             │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│ 6. All subscribed clients receive event                │
│    - RLS policies apply to events too!                 │
│    - Users only see changes they're allowed to see     │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│ 7. UI updates automatically in Realtime tab            │
└─────────────────────────────────────────────────────────┘
```

**Key Concepts:**

- ✅ **Database required** - Monitors actual table
- ✅ **Persistent** - Data stored permanently
- 🔐 **RLS applies** - Users only see their changes
- ⚡ **Near-instant** - ~100ms latency
- 📊 **Full row data** - Get complete before/after state

---

## 🏗️ Architecture & Data Flow

### Overall Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (React App)                       │
│                   localhost:5173                             │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │          Supabase Client Instance                   │    │
│  │  (src/integrations/supabase/client.ts)             │    │
│  │                                                     │    │
│  │  - Manages authentication                          │    │
│  │  - Handles all API requests                        │    │
│  │  - Maintains WebSocket connections                 │    │
│  └────────────────┬───────────────────────────────────┘    │
│                   │                                          │
│  ┌────────────────┴───────────────────────────────────┐    │
│  │                 React Components                    │    │
│  │                                                     │    │
│  │  - AuthDemo.tsx      (Authentication)              │    │
│  │  - DatabaseDemo.tsx  (CRUD Operations)             │    │
│  │  - ChatDemo.tsx      (Real-time Chat)              │    │
│  │  - RealtimeDemo.tsx  (DB Real-time)                │    │
│  │  - StorageDemo.tsx   (File Storage)                │    │
│  └─────────────────────────────────────────────────────┘    │
└───────────────────┬──────────────────────────────────────────┘
                    │
                    │ HTTPS (REST) + WebSocket
                    │
┌───────────────────▼──────────────────────────────────────────┐
│              SUPABASE BACKEND                                │
│              your-project.supabase.co                        │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │   Auth Service   │  │   PostgREST      │                │
│  ���   (GoTrue)       │  │   (Auto REST API)│                │
│  │                  │  │                  │                │
│  │ - User mgmt      │  │ - SQL → REST     │                │
│  │ - JWT tokens     │  │ - Type-safe      │                │
│  │ - Sessions       │  │ - Auto CRUD      │                │
│  └──────────────────┘  └──────────────────┘                │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │   PostgreSQL 15  │  │   Realtime       │                │
│  │   Database       │  │   (WebSocket)    │                │
│  │                  │  │                  │                │
│  │ - Tables         │  │ - Broadcast      │                │
│  │ - RLS policies   │  │ - Presence       │                │
│  │ - Functions      │  │ - PG Changes     │                │
│  └──────────────────┘  └──────────────────┘                │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │   Storage        │  │   Edge Functions │                │
│  │   (S3-compat)    │  │   (Deno)         │                │
│  │                  │  │                  │                │
│  │ - Buckets        │  │ - Serverless     │                │
│  │ - Policies       │  │ - Custom APIs    │                │
│  │ - CDN            │  │ - HTTP endpoints │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Understanding Realtime Features

### The Three Types of Realtime

Supabase Realtime has **three distinct modes** that work differently:

#### 📻 **1. Broadcast** (Used in Chat)

```typescript
// Create broadcast channel
const channel = supabase.channel('my-channel', {
  config: { broadcast: { self: true } }
});

// Send message
channel.send({
  type: 'broadcast',
  event: 'message',
  payload: { text: 'Hello!' }
});

// Receive messages
channel.on('broadcast', { event: 'message' }, (payload) => {
  console.log('Received:', payload);
});
```

**Characteristics:**

- ❌ No database required
- ❌ No data storage
- ⚡ Instant WebSocket delivery
- 🔄 Sent to all connected clients
- 💨 Ephemeral (disappears on disconnect)

**Use Cases:**

- ✅ Chat applications
- ✅ Live notifications
- ✅ Collaborative cursors
- ✅ Game state updates
- ✅ Live voting/polls

**Analogy:** Like talking on a walkie-talkie - message travels instantly but isn't recorded.

---

#### 👥 **2. Presence** (Used for Online Users)

```typescript
// Track presence
const presence = supabase.channel('online-users');

// Start tracking this user
presence.subscribe(async (status) => {
  if (status === 'SUBSCRIBED') {
    await presence.track({
      userId: '123',
      userName: 'John',
      status: 'online'
    });
  }
});

// Listen to presence changes
presence
  .on('presence', { event: 'sync' }, () => {
    const state = presence.presenceState();
    console.log('Online users:', Object.keys(state).length);
  })
  .on('presence', { event: 'join' }, ({ newPresences }) => {
    console.log('User joined:', newPresences);
  })
  .on('presence', { event: 'leave' }, ({ leftPresences }) => {
    console.log('User left:', leftPresences);
  });
```

**Characteristics:**

- ❌ No database required
- 🧠 Stored in-memory only
- 🔄 Auto-cleanup on disconnect
- 👁️ Track who's currently connected
- ⏱️ Temporary state

**Use Cases:**

- ✅ "Who's online" indicators
- ✅ User count displays
- ✅ Typing indicators
- ✅ Active users list
- ✅ Collaborative editing presence

**Analogy:** Like a sign-in sheet that automatically erases when someone leaves.

---

#### 🗄️ **3. Postgres Changes** (Used in Database Realtime)

```typescript
// Listen to database changes
supabase
  .channel('db-changes')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'notes' },
    (payload) => {
      console.log('Database changed:', payload);
      // payload.eventType: INSERT, UPDATE, or DELETE
      // payload.new: New row data (for INSERT/UPDATE)
      // payload.old: Old row data (for UPDATE/DELETE)
    }
  )
  .subscribe();
```

**Characteristics:**

- ✅ Requires database table
- ✅ Data stored permanently
- 🔐 RLS policies apply
- 📊 Full row data available
- ⚡ ~100ms latency

**Setup Required:**

```sql
-- Enable realtime for table
ALTER PUBLICATION supabase_realtime ADD TABLE public.notes;
ALTER TABLE public.notes REPLICA IDENTITY FULL;
```

**Use Cases:**

- ✅ Live dashboards
- ✅ Real-time feeds
- ✅ Inventory tracking
- ✅ Collaborative documents
- ✅ Activity streams

**Analogy:** Like a security camera that records everything and sends you instant alerts.

---

### Comparison Table

| Feature                    | Broadcast    | Presence      | Postgres Changes    |
| -------------------------- | ------------ | ------------- | ------------------- |
| **Database Needed**  | ❌ No        | ❌ No         | ✅ Yes              |
| **Table Required**   | ❌ No        | ❌ No         | ✅ Yes              |
| **Data Stored**      | ❌ No        | ❌ No         | ✅ Yes (PostgreSQL) |
| **Persistent**       | ❌ No        | ❌ No         | ✅ Yes              |
| **Speed**            | ⚡ Instant   | ⚡ Instant    | ⚡ ~100ms           |
| **Transport**        | WebSocket    | WebSocket     | WebSocket + DB      |
| **RLS Applies**      | ❌ No        | ❌ No         | ✅ Yes              |
| **Max Message Size** | ~250KB       | ~10KB         | Unlimited           |
| **Best For**         | Chat, events | Online status | DB updates          |

---

### Visual Comparison

```
┌─────────────────────────────────────────────────────────────┐
│                         BROADCAST                            │
│                                                              │
│  User A → WebSocket → Supabase → WebSocket → User B        │
│                           ↓                                  │
│                      [No Storage]                            │
│                                                              │
│  ✅ Fast    ❌ No history    💨 Ephemeral                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                         PRESENCE                             │
│                                                              │
│  User connects → Tracked in memory → Auto-removed on exit   │
│                                                              │
│  ✅ Real-time count    ❌ No history    🧠 In-memory        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    POSTGRES CHANGES                          │
│                                                              │
│  User → INSERT → PostgreSQL DB → WAL → Realtime → Users    │
│              ↓                                               │
│         [Stored Forever]                                     │
│                                                              │
│  ✅ Persistent    ✅ History    🔐 RLS Protected            │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
supabase-showcase/
│
├── public/                          # Static files
│   ├── favicon.ico                  # App icon
│   ├── favicon.svg                  # SVG icon
│   ├── placeholder.svg              # Placeholder image
│   └── robots.txt                   # SEO/crawler config
│
├── sql-setup/                       # Database setup scripts
│   ├── 01-storage-setup.sql         # Storage bucket creation
│   ├── 02-create-tables.sql         # Notes table schema
│   ├── 03-rls-policies.sql          # Security policies
│   ├── 04-functions-triggers.sql    # Database functions
│   ├── 05-realtime-setup.sql        # Real-time configuration
│   ├── 06-bonus-examples.sql        # Extra examples
│   └── README.md                    # Setup instructions
│
├── src/
│   ├── components/                  # React components
│   │   │
│   │   ├── ui/                      # shadcn/ui components
│   │   │   ├── button.tsx           # Button component
│   │   │   ├── input.tsx            # Input component
│   │   │   ├── card.tsx             # Card component
│   │   │   ├── badge.tsx            # Badge component
│   │   │   ├── scroll-area.tsx      # Scrollable area
│   │   │   ├── toast.tsx            # Toast notifications
│   │   │   └── ... (35+ components)
│   │   │
│   │   ├── AuthDemo.tsx             # Authentication UI
│   │   │   - Sign up form
│   │   │   - Sign in form
│   │   │   - User profile display
│   │   │   - Sign out button
│   │   │
│   │   ├── ChatDemo.tsx             # Real-time chat
│   │   │   - Message input
│   │   │   - Message list
│   │   │   - Online users
│   │   │   - Presence tracking
│   │   │
│   │   ├── DatabaseDemo.tsx         # Database operations
│   │   │   - Create notes form
│   │   │   - Notes list
│   │   │   - Delete functionality
│   │   │
│   │   ├── EdgeFunctionDemo.tsx     # Edge function calls
│   │   │   - Function invocation
│   │   │   - Response display
│   │   │
│   │   ├── FeatureCard.tsx          # Feature container
│   │   │   - Card wrapper
│   │   │   - Icon display
│   │   │   - Collapsible content
│   │   │
│   │   ├── RealtimeDemo.tsx         # DB real-time events
│   │   │   - Event listener
│   │   │   - Event history
│   │   │   - Online counter
│   │   │
│   │   └── StorageDemo.tsx          # File storage
│   │       - Upload form
│   │       - File list
│   │       - Delete files
│   │
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts            # Supabase client
│   │       │   - Client initialization
│   │       │   - Auth configuration
│   │       │
│   │       └── types.ts             # TypeScript types
│   │           - Auto-generated from DB
│   │           - Type-safe queries
│   │
│   ├── pages/
│   │   ├── Index.tsx                # Main page
│   │   │   - Feature grid
│   │   │   - Hero section
│   │   │   - Component layout
│   │   │
│   │   └── NotFound.tsx             # 404 error page
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── use-mobile.tsx           # Mobile detection
│   │   └── use-toast.ts             # Toast notifications
│   │
│   ├── lib/
│   │   └── utils.ts                 # Utility functions
│   │       - cn() for classnames
│   │       - Helper functions
│   │
│   ├── App.tsx                      # Root component
│   │   - Router setup
│   │   - Global providers
│   │
│   ├── main.tsx                     # App entry point
│   │   - React DOM render
│   │   - StrictMode wrapper
│   │
│   ├── App.css                      # Component styles
│   ├── index.css                    # Global styles
│   └── vite-env.d.ts                # Vite types
│
├── supabase/                        # Supabase config
│   ├── config.toml                  # Local config
│   │
│   └── functions/                   # Edge functions
│       └── hello-world/
│           └── index.ts             # Example function
│
├── .env                             # Environment variables
├── .env.example                     # Example env file
├── .gitignore                       # Git ignore rules
│
├── components.json                  # shadcn/ui config
├── eslint.config.js                 # ESLint rules
├── index.html                       # HTML template
├── package.json                     # Dependencies
├── postcss.config.js                # PostCSS config
├── tailwind.config.ts               # Tailwind config
├── tsconfig.json                    # TypeScript config
├── tsconfig.app.json                # App TS config
├── tsconfig.node.json               # Node TS config
├── vite.config.ts                   # Vite configuration
│
├── SUPABASE_LEARNING_GUIDE.md       # Learning guide
└── README.md                        # This file
```

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**

```bash
git add .
git commit -m "Ready for production"
git push origin master
```

2. **Import to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
3. **Configure Environment Variables**

   - Add these in Vercel dashboard:

   ```
   VITE_SUPABASE_URL
   VITE_SUPABASE_PUBLISHABLE_KEY
   VITE_SUPABASE_PROJECT_ID
   ```
4. **Deploy**

   - Click "Deploy"
   - Wait 1-2 minutes
   - Your app is live! 🎉

### Deploy to Netlify

1. **Install Netlify CLI**

```bash
npm install -g netlify-cli
```

2. **Build**

```bash
npm run build
```

3. **Deploy**

```bash
netlify deploy --prod
```

4. **Set Environment Variables**
   - Go to Netlify dashboard
   - Site settings → Environment variables
   - Add your Supabase credentials

### Deploy Edge Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-id

# Deploy functions
supabase functions deploy hello-world
```

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### 1. "Failed to fetch" Errors

**Symptoms:** All Supabase calls fail with network errors

**Causes:**

- Wrong Supabase URL or API key
- Environment variables not loaded
- CORS issues

**Solutions:**

```bash
# 1. Check .env file exists and has correct values
cat .env

# 2. Restart dev server
npm run dev

# 3. Clear browser cache and localStorage
localStorage.clear();

# 4. Verify credentials in Supabase dashboard
```

---

#### 2. Real-time Not Working

**Symptoms:** Database changes don't trigger events

**Causes:**

- Real-time not enabled for table
- RLS blocking events
- Missing REPLICA IDENTITY

**Solutions:**

```sql
-- Run in SQL Editor:

-- 1. Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE public.notes;

-- 2. Set replica identity
ALTER TABLE public.notes REPLICA IDENTITY FULL;

-- 3. Verify setup
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
```

---

#### 3. RLS Blocking Operations

**Symptoms:** "New row violates row-level security policy"

**Causes:**

- RLS policies not created
- User not authenticated
- Policy conditions don't match

**Solutions:**

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'notes';

-- List all policies
SELECT * FROM pg_policies WHERE tablename = 'notes';

-- Temporarily disable RLS for testing (NOT in production!)
ALTER TABLE notes DISABLE ROW LEVEL SECURITY;

-- Re-enable with proper policies
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
```

---

#### 4. Authentication Issues

**Symptoms:** User can't sign in or sign up

**Causes:**

- Email not confirmed
- Wrong credentials
- Auth service not configured

**Solutions:**

```typescript
// Check auth state
supabase.auth.getSession().then(({ data }) => {
  console.log('Current session:', data);
});

// Test if user exists
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'test@example.com',
  password: 'test123'
});
console.log('Auth result:', { data, error });
```

**In Supabase Dashboard:**

- Go to **Authentication** → **Users**
- Check if user exists and is confirmed
- Try resetting password

---

#### 5. CORS Errors with Edge Functions

**Symptoms:** "Access-Control-Allow-Origin" errors

**Solution:** Add CORS headers to your function:

```typescript
// supabase/functions/your-function/index.ts
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  // Your function logic...
  
  return new Response(data, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
});
```

---

#### 6. Storage Upload Fails

**Symptoms:** Files won't upload

**Causes:**

- Storage bucket doesn't exist
- Missing storage policies
- File size too large

**Solutions:**

```sql
-- Check if bucket exists
SELECT * FROM storage.buckets WHERE name = 'avatars';

-- Check storage policies
SELECT * FROM storage.policies;

-- Create bucket if missing
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);
```

---

#### 7. Type Errors in TypeScript

**Symptoms:** TypeScript compilation errors

**Solutions:**

```bash
# Regenerate types from database
npx supabase gen types typescript --project-id your-project-id > src/integrations/supabase/types.ts

# Or use the direct link
npx supabase gen types typescript --project-id your-project-id --schema public > src/integrations/supabase/types.ts
```

---

## ❓ Frequently Asked Questions

### General

**Q: Is this production-ready?**
A: Yes! This project follows production best practices including RLS, type safety, error handling, and security measures.

**Q: Can I use this as a starter template?**
A: Absolutely! Feel free to clone and modify for your needs. Just remember to update the Supabase credentials.

**Q: Does this work with Supabase's free tier?**
A: Yes! All features work perfectly on the free tier.

---

### Authentication

**Q: Can I add social auth (Google, GitHub, etc.)?**
A: Yes! Just enable providers in Supabase dashboard and add the auth buttons.

```typescript
// Google Sign In
await supabase.auth.signInWithOAuth({
  provider: 'google',
});
```

**Q: How do I handle password reset?**
A: Use the password reset flow:

```typescript
await supabase.auth.resetPasswordForEmail(email);
```

---

### Database

**Q: Why does the chat NOT use a database?**
A: Chat uses Broadcast mode for instant delivery without storage overhead. Messages are ephemeral by design.

**Q: How can I make chat messages persistent?**
A: Create a `messages` table and use Postgres Changes instead of Broadcast:

```typescript
// Save to DB
await supabase.from('messages').insert({ text, user_id });

// Listen to changes
supabase
  .channel('messages')
  .on('postgres_changes', { event: 'INSERT', table: 'messages' }, ...)
  .subscribe();
```

**Q: How do I add more tables?**
A: Create tables in SQL Editor, add RLS policies, and regenerate types.

---

### Real-time

**Q: What's the difference between Broadcast and Postgres Changes?**
A: See the [Real-time Explained](#-understanding-realtime-features) section above.

**Q: Can I have multiple users see the same data in real-time?**
A: Yes! Both Broadcast and Postgres Changes support multiple subscribers.

**Q: Is there a message size limit?**
A: Broadcast: ~250KB per message. Postgres Changes: No limit (it's database-stored).

---

### Deployment

**Q: Where can I deploy this?**
A: Vercel, Netlify, Cloudflare Pages, or any static hosting service.

**Q: Do I need to configure anything for deployment?**
A: Just add environment variables on your hosting platform.

**Q: Can I deploy Edge Functions separately?**
A: Yes, use Supabase CLI: `supabase functions deploy`

---

### Performance

**Q: How many concurrent users can this handle?**
A: Supabase free tier supports:

- 500 concurrent connections
- 2GB database
- 1GB file storage
- Unlimited API requests

**Q: Is real-time fast enough for games?**
A: Broadcast mode has ~50-100ms latency - suitable for turn-based games, but not for fast-action games.

---

## 🤝 Contributing

Contributions welcome! Here's how:

1. **Fork the repository**
2. **Create a feature branch**

```bash
git checkout -b feature/amazing-feature
```

3. **Make your changes**

   - Follow existing code style
   - Add comments for complex logic
   - Update documentation
4. **Test thoroughly**

```bash
npm run dev
npm run build
```

5. **Commit with clear message**

```bash
git commit -m "Add: Real-time video chat feature"
```

6. **Push and create Pull Request**

```bash
git push origin feature/amazing-feature
```

### Development Guidelines

- Use TypeScript for type safety
- Follow React best practices
- Keep components small and focused
- Add JSDoc comments for functions
- Update README for new features
- Test on multiple browsers

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

```
MIT License

Copyright (c) 2025 xCloud

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 🙏 Acknowledgments

This project wouldn't be possible without:

- **[Supabase](https://supabase.com)** - Amazing open-source Firebase alternative
- **[shadcn/ui](https://ui.shadcn.com)** - Beautiful, accessible component library
- **[Radix UI](https://www.radix-ui.com)** - Unstyled, accessible UI primitives
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[Vite](https://vitejs.dev)** - Next-generation frontend tooling
- **[TypeScript](https://www.typescriptlang.org)** - JavaScript with syntax for types
- **[React](https://react.dev)** - The library for web and native user interfaces

Special thanks to the open-source community! 💚

---

## 📞 Support & Resources

### Official Documentation

- 📚 [Supabase Docs](https://supabase.com/docs)
- 📖 [Supabase Guides](https://supabase.com/docs/guides)
- 🎥 [Supabase YouTube](https://www.youtube.com/@Supabase)

### Community

- 💬 [Supabase Discord](https://discord.supabase.com)
- 🐦 [Supabase Twitter](https://twitter.com/supabase)
- 📰 [Supabase Blog](https://supabase.com/blog)

### This Project

- 🐛 [Report Bug](https://github.com/mrx-arafat/supabase-showcase/issues)
- 💡 [Request Feature](https://github.com/mrx-arafat/supabase-showcase/issues)
- ⭐ [Star on GitHub](https://github.com/mrx-arafat/supabase-showcase)

---

## 📊 Project Stats

- **Lines of Code:** ~5,000+
- **Components:** 35+ UI components
- **Features:** 6 major feature demos
- **SQL Scripts:** 6 setup scripts
- **TypeScript:** 100% type-safe
- **RLS Policies:** Complete security
- **Real-time Modes:** All 3 types implemented

---

<div align="center">

## 🌟 Star This Repository!

If you find this project helpful, please consider giving it a ⭐

**Built with ❤️ by [xCloud](https://github.com/mrx-arafat)**

*Learning Supabase has never been this easy and fun!*

---

[⬆ Back to Top](#-supabase-showcase---complete-learning-platform)

</div>
