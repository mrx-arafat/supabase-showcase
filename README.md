# Supabase Learning Platform (xCloud)

An interactive learning project that showcases core Supabase features (Auth, Database, Storage, Edge Functions, and Realtime) in a single, modern React app. This edition of the project is maintained by **xCloud**.

## Project Info

- **Repository**: https://github.com/mrx-arafat/supabase-showcase
- **Tech stack**: Vite, React, TypeScript, Tailwind CSS, shadcn-ui, Supabase

## Getting Started

You'll need **Node.js** and **npm** installed. (Using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) is recommended.)

```sh
# 1. Clone the repository
git clone https://github.com/mrx-arafat/supabase-showcase.git

# 2. Navigate into the project directory
cd supabase-showcase

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Then open the local URL shown in your terminal (usually http://localhost:5173).

## Features

This project includes:

- **Authentication Demo** – Email/password sign up & sign in
- **Database Demo** – Create and manage notes using Supabase Postgres
- **Storage Demo** – Upload and manage files in Supabase Storage
- **Edge Function Demo** – Call a sample serverless function
- **Realtime Demo** – Broadcast and receive live updates between clients

## Editing the Code

You can develop using any workflow you prefer:

- Use your local IDE (VS Code, WebStorm, etc.)
- Edit files directly in GitHub and pull changes locally

Changes pushed to the `main` (or `master`) branch will update any deployments you have configured (for example, on xCloud or other hosting providers).

## Deployment

This is a standard Vite + React single-page application. You can deploy it to any modern static hosting platform or your own infrastructure. Typical steps are:

```sh
npm run build
```

Then deploy the contents of the `dist` directory to your hosting provider of choice (e.g., xCloud, Vercel, Netlify, etc.).

## License

This project is provided as an educational Supabase showcase and is maintained by **xCloud**.
