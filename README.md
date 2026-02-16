# Marktrabit — Smart Bookmark Manager

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Auth_&_DB-green?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwind-css)
![Vercel](https://img.shields.io/badge/Deployment-Vercel-black?logo=vercel)

**A real-time, privacy-focused bookmark manager built for the Astrabit Technologies technical assessment.**

[Live Demo](https://marktrabit.vercel.app/)
(Visit https://marktrabit.vercel.app/ if the link isn't working)

</div>

---

## Overview

Marktrabit is a responsive web application that allows users to save and manage bookmarks. It uses **Google OAuth** for authentication and **Supabase Realtime** to sync data instantly across tabs without refreshing. User data is protected using PostgreSQL **Row Level Security (RLS)** policies.

## Features

- **Google Authentication:** Passwordless login flow using Supabase Auth.
- **Real-time Sync:** Bookmarks appear/disappear instantly across devices using PostgreSQL Change Data Capture (CDC).
- **Private Data:** RLS policies ensure users can only create, read, and delete their own bookmarks.
- **Dark Mode UI:** Aesthetic dark theme built with Tailwind CSS and Framer Motion animations.
- **Responsive Design:** Works on mobile and desktop.

---

## 🛠 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Backend:** [Supabase](https://supabase.com/) (PostgreSQL, Auth, Realtime)
- **Deployment:** [Vercel](https://vercel.com/)

---

## Technical Challenges & Solutions

**1. Supabase Policy Configuration**
* **Challenge:** Encountered persistent logical errors and bugs when attempting to modify the pre-configured Row Level Security (RLS) policies to implement privacy system.
* **Solution:** Instead of debugging the default configuration, I deleted the existing policies and rebuilt them from scratch using Supabase's native templates. This ensured a clean, secure implementation where users can strictly only access their own data.

**2. Learning Curve (Next.js & Supabase)**
* **Challenge:** This was my first time using both Next.js and Supabase, as my background is primarily in Python.
* **Solution:** I completed a targeted course on Next.js to understand the App Router architecture, picking it up quickly due to my foundation in React. I simultaneously learned Supabase's authentication and database logic through hands-on implementation as I built the features.current user_id.

## Getting Started

Follow these steps to run the project locally.

### 1. Clone the repository
```bash
git clone https://github.com/unusualcatcher/Marktrabit
cd Marktrabit
2. Install dependencies
Bash
npm install
```
3. Configure Environment Variables
Create a .env.local file in the root directory:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
4. Database Schema
Run this SQL in your Supabase SQL Editor to set up the table and security policies:

```SQL

create table bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  created_at timestamptz default now()
);


alter table bookmarks enable row level security;


create policy "Users can see their own bookmarks"
on bookmarks for select
using (auth.uid() = user_id);


create policy "Users can insert their own bookmarks"
on bookmarks for insert
with check (auth.uid() = user_id);


create policy "Users can delete their own bookmarks"
on bookmarks for delete
using (auth.uid() = user_id);
```
5. Run the development server
```bash
npm run dev
Open http://localhost:3000 to view the app.
```

# 📂 Project Structure
```bash
marktrabit/
├── app/
│   ├── auth/callback/    # Handles OAuth redirect
│   ├── login/            # Login page (Google Auth)
│   ├── globals.css       # Tailwind directives
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main dashboard (CRUD + Realtime)
├── lib/
│   └── supabase.ts       # Supabase client initialization
└── public/               # Static assets
```

# License
Developed by Aditya Taneja for the Astrabit Technologies technical assessment.