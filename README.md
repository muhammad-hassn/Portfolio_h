# Muhammad Hassan — AI Automation & Full-Stack Developer Portfolio

A premium freelance portfolio website with a full CMS dashboard for managing content, projects, and client inquiries.

## Overview

This is a production-quality freelance developer portfolio designed to convert visitors into clients. It features:

- **Public website**: Hero with animated technical visualization, services, problems solved, selected work, process timeline, tech stack, about, and contact form
- **Admin dashboard**: Full CMS for managing profile, services, problems, skills, projects (with image/video upload), and contact messages
- **Authentication**: Supabase Auth with email/password
- **Database**: Supabase PostgreSQL with Row Level Security
- **Storage**: Supabase Storage for profile and project media

## Tech Stack

- **Frontend**: Next.js 13 (App Router), TypeScript, React, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Supabase (Auth, PostgreSQL, Storage)
- **Icons**: Lucide React
- **Fonts**: Plus Jakarta Sans (display), Inter (body), JetBrains Mono (mono)

## Environment Setup

The Supabase credentials are pre-populated in the hosted environment. For local development:

1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase project URL and anon key

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Database Setup

The database schema and RLS policies are applied via Supabase migrations. The migration files are in `supabase/migrations/`. In the hosted environment, these are applied automatically via the Supabase MCP tools.

### Tables

- `profiles` — admin profile data (name, hero text, about, social links)
- `services` — service offerings with ordering and visibility
- `problems` — business pain points with solutions
- `skills` — technology skills grouped by category
- `projects` — portfolio projects with case study data and media
- `contact_messages` — client inquiries from the contact form

### Storage Buckets

- `profile-media` — profile images
- `project-media` — project images and videos
- `skill-media` — skill icons

All buckets are public-readable, authenticated-write.

## Authentication Setup

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add user" and enter an email and password
4. Use those credentials to log in at `/admin/login`

The first user created will be the admin. The profile record is created automatically when the admin first saves their profile through the dashboard.

## Local Development

```bash
npm install
npm run dev
```

The dev server runs automatically in the hosted environment.

## Build

```bash
npm run build
```

## Admin Setup

1. Create a user in Supabase Auth (email/password)
2. Navigate to `/admin/login`
3. Sign in with your credentials
4. Go to Profile to set up your hero content, about text, and profile image
5. Add services, problems, skills, and projects through their respective admin pages
6. Check messages in the Messages inbox

## Project Structure

```
app/
  layout.tsx          # Root layout with fonts and metadata
  page.tsx           # Public homepage
  not-found.tsx      # 404 page
  robots.ts          # robots.txt
  sitemap.ts         # sitemap.xml
  work/[slug]/       # Project detail pages
  admin/
    layout.tsx       # Admin shell with sidebar
    page.tsx         # Dashboard overview
    login/           # Login page
    profile/         # Profile CMS
    services/        # Services CMS
    problems/        # Problems CMS
    skills/          # Skills CMS
    projects/        # Projects CMS with media uploader
    messages/        # Message inbox
    settings/        # Site settings

components/
  layout/            # Navbar, Footer, AnnouncementBar
  sections/          # Homepage sections (Hero, Services, etc.)
  motion/           # Reusable animation components
  auth/             # Auth provider and route protection
  ui/               # shadcn/ui components

lib/
  supabase/         # Supabase clients
  types.ts          # TypeScript types
  data.ts           # Data fetching helpers
  utils.ts          # Utility functions
```

## Deployment

The project is configured for Netlify deployment via `netlify.toml`. The build command is `npm run build`.

## Features

- Premium dark theme with electric blue accent
- Animated hero with technical system visualization
- Scroll-linked process timeline
- Capability marquee
- Interactive tech stack with category filtering
- Responsive design (mobile to large desktop)
- SEO optimized with dynamic metadata, sitemap, and robots.txt
- Accessible with keyboard navigation and reduced-motion support
- Contact form with validation and Supabase persistence
- Full CRUD CMS for all content
- Image and video upload for projects
- Message inbox with filters and email reply
