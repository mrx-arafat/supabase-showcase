# 🚀 Supabase Showcase

<div align="center">

![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**A complete, production-ready showcase of Supabase features with a beautiful, modern UI**

[Live Demo](#) • [Documentation](#features) • [Report Bug](https://github.com/mrx-arafat/supabase-showcase/issues)

</div>

---

## ✨ Features

This project demonstrates **all major Supabase features** in a single, cohesive application:

### 🔐 **Authentication Demo**
- Email/password sign up & sign in
- Session management
- Protected routes
- User profile management

### 💾 **Database Demo**
- CRUD operations with PostgreSQL
- Row Level Security (RLS) policies
- Real-time data subscriptions
- Custom SQL functions and triggers

### 📁 **Storage Demo**
- File upload/download
- Public and private buckets
- Image preview
- File management

### ⚡ **Edge Functions Demo**
- Serverless function execution
- Custom API endpoints
- Request/response handling
- Beautiful UI with animations

### 🔴 **Realtime Demo**
- Live data synchronization
- Presence tracking
- Broadcast messages
- Multi-tab updates

---

## 🛠️ Tech Stack

- **Framework**: [Vite](https://vitejs.dev/) + [React 18](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Backend**: [Supabase](https://supabase.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **npm** (or yarn/pnpm)
- A **Supabase account** ([sign up free](https://supabase.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mrx-arafat/supabase-showcase.git
   cd supabase-showcase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example env file
   cp .env.example .env
   
   # Edit .env and add your Supabase credentials
   # Get them from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
   ```

4. **Set up your Supabase database**
   
   Run the SQL scripts in order from the `sql-setup/` folder:
   - `01-storage-setup.sql` - Create storage buckets
   - `02-create-tables.sql` - Create database tables
   - `03-rls-policies.sql` - Set up security policies
   - `04-functions-triggers.sql` - Add helper functions
   - `05-realtime-setup.sql` - Enable realtime

5. **Deploy the Edge Function**
   ```bash
   # Login to Supabase CLI
   npx supabase login
   
   # Deploy the hello-world function
   npx supabase functions deploy hello-world --project-ref YOUR_PROJECT_ID
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to `http://localhost:8080` (or the URL shown in your terminal)

---

## 📂 Project Structure

```
supabase-showcase/
├── src/
│   ├── components/          # React components
│   │   ├── AuthDemo.tsx
│   │   ├── DatabaseDemo.tsx
│   │   ├── StorageDemo.tsx
│   │   ├── EdgeFunctionDemo.tsx
│   │   ├── RealtimeDemo.tsx
│   │   └── ui/              # shadcn/ui components
│   ├── integrations/
│   │   └── supabase/        # Supabase client & types
│   ├── pages/               # Page components
│   ├── hooks/               # Custom React hooks
│   └── lib/                 # Utility functions
├── supabase/
│   ├── functions/           # Edge Functions
│   │   └── hello-world/
│   └── migrations/          # Database migrations
├── sql-setup/               # SQL setup scripts
│   ├── 01-storage-setup.sql
│   ├── 02-create-tables.sql
│   ├── 03-rls-policies.sql
│   ├── 04-functions-triggers.sql
│   └── 05-realtime-setup.sql
├── public/                  # Static assets
└── ...config files
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
```

Get these values from your [Supabase Dashboard](https://supabase.com/dashboard) under **Settings** → **API**.

### Supabase Setup

The `sql-setup/` folder contains all necessary SQL scripts. Run them in order in your Supabase SQL Editor:

1. **Storage Setup** - Creates file storage buckets
2. **Tables** - Creates database schema
3. **RLS Policies** - Secures your data
4. **Functions & Triggers** - Adds automation
5. **Realtime** - Enables live updates

---

## 📚 Documentation

### Authentication

```typescript
// Sign up a new user
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password'
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password'
})
```

### Database Operations

```typescript
// Create a note
const { data, error } = await supabase
  .from('notes')
  .insert({ title: 'My Note', content: 'Hello World' })

// Read notes
const { data, error } = await supabase
  .from('notes')
  .select('*')
  .order('created_at', { ascending: false })
```

### Edge Functions

```typescript
// Call an edge function
const { data, error } = await supabase.functions.invoke('hello-world', {
  body: { name: 'Developer' }
})
```

### Realtime Subscriptions

```typescript
// Subscribe to database changes
const channel = supabase
  .channel('notes-changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'notes' },
    (payload) => console.log('Change received!', payload)
  )
  .subscribe()
```

---

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) components with custom styling:

- **Cards** with gradient backgrounds
- **Buttons** with hover animations
- **Forms** with validation
- **Toast notifications**
- **Loading states** with spinners
- **Error handling** UI

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` folder.

### Deploy Options

- **Vercel**: Connect your GitHub repo for auto-deploys
- **Netlify**: Drag & drop the `dist` folder
- **Supabase Hosting**: Coming soon
- **Any static host**: Upload the `dist` folder

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for the amazing backend platform
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Lucide](https://lucide.dev/) for the icons

---

## 📧 Contact

**Arafat** - [@mrx-arafat](https://github.com/mrx-arafat)

**Project Link**: [https://github.com/mrx-arafat/supabase-showcase](https://github.com/mrx-arafat/supabase-showcase)

---

<div align="center">

Made with ❤️ by [xCloud](https://github.com/mrx-arafat)

⭐ Star this repo if you find it helpful!

</div>

This is a standard Vite + React single-page application. You can deploy it to any modern static hosting platform or your own infrastructure. Typical steps are:

```sh
npm run build
```

Then deploy the contents of the `dist` directory to your hosting provider of choice (e.g., xCloud, Vercel, Netlify, etc.).

## License

This project is provided as an educational Supabase showcase and is maintained by **xCloud**.
