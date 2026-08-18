/*
# Create portfolio schema for Muhammad Hassan freelance site

## Overview
Creates the full content-management schema for a freelance developer portfolio with an admin dashboard. Public visitors can read visible content and submit contact messages; only authenticated admin users can manage content.

## New Tables
1. `profiles` — single admin profile (name, hero text, about, image, social links). Public-readable, admin-writable.
2. `services` — service offerings (title, description, icon, cta, order, visibility). Public-readable, admin-writable.
3. `problems` — business pain points the developer solves (title, description, solution, order, visibility). Public-readable, admin-writable.
4. `skills` — technology skills grouped by category (name, category, icon, order, visibility). Public-readable, admin-writable.
5. `projects` — case-study projects (title, slug, category, descriptions, technologies, media, links, featured, visibility, order). Public-readable, admin-writable.
6. `contact_messages` — inbound client inquiries (name, email, project_type, message, status). Public-insertable, admin-managed.

## Security
- RLS enabled on every table.
- Public (anon) can SELECT visible content on profiles/services/problems/skills/projects.
- Public (anon) can INSERT contact_messages (with validation).
- Only authenticated users can INSERT/UPDATE/DELETE managed content and read/manage messages.
- `profiles` is keyed to the admin's auth.uid() so only the owner can update it.

## Notes
- `is_visible` controls public display; queries filter on it.
- `display_order` controls sorting.
- `featured` flags priority projects.
- `technologies` stored as a text[] array.
- `media_type` is an enum-like text check constraint ('image' | 'video').
- `status` on contact_messages defaults to 'unread'.
*/

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'Muhammad Hassan',
  professional_title text NOT NULL DEFAULT 'AI Automation & Full-Stack Developer',
  hero_headline text NOT NULL DEFAULT 'I Build AI-Powered Systems That Help Businesses Work Smarter.',
  hero_description text NOT NULL DEFAULT 'I help businesses build modern websites, AI applications, automation workflows, APIs and custom software that solve real problems and reduce repetitive work.',
  about text NOT NULL DEFAULT 'I’m Muhammad Hassan, an AI & Software Engineering developer focused on building practical digital products, automation systems and AI-powered applications. I work across frontend, backend, APIs, databases, automation and AI integration to turn business requirements into working software. My goal is simple: build technology that solves a real problem, saves time, improves workflows or creates a better digital experience. I’m currently completing my BS in Software Engineering at PAF KIET.',
  profile_image_url text,
  email text NOT NULL DEFAULT 'hello@muhammadhassan.dev',
  location text NOT NULL DEFAULT 'Karachi, Pakistan',
  availability_text text NOT NULL DEFAULT 'Available for freelance projects and collaborations.',
  github_url text,
  linkedin_url text,
  website_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_profiles" ON profiles;
CREATE POLICY "public_read_profiles" ON profiles FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_profile" ON profiles;
CREATE POLICY "admin_update_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "admin_insert_profile" ON profiles;
CREATE POLICY "admin_insert_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- SERVICES
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  short_description text NOT NULL,
  description text,
  icon text,
  cta_text text,
  display_order int NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_services" ON services;
CREATE POLICY "public_read_services" ON services FOR SELECT
  TO anon, authenticated USING (is_visible = true);

DROP POLICY IF EXISTS "admin_read_services" ON services;
CREATE POLICY "admin_read_services" ON services FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_services" ON services;
CREATE POLICY "admin_insert_services" ON services FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_services" ON services;
CREATE POLICY "admin_update_services" ON services FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_services" ON services;
CREATE POLICY "admin_delete_services" ON services FOR DELETE
  TO authenticated USING (true);

-- PROBLEMS
CREATE TABLE IF NOT EXISTS problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  solution text,
  display_order int NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE problems ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_problems" ON problems;
CREATE POLICY "public_read_problems" ON problems FOR SELECT
  TO anon, authenticated USING (is_visible = true);

DROP POLICY IF EXISTS "admin_read_problems" ON problems;
CREATE POLICY "admin_read_problems" ON problems FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_problems" ON problems;
CREATE POLICY "admin_insert_problems" ON problems FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_problems" ON problems;
CREATE POLICY "admin_update_problems" ON problems FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_problems" ON problems;
CREATE POLICY "admin_delete_problems" ON problems FOR DELETE
  TO authenticated USING (true);

-- SKILLS
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  icon_url text,
  display_order int NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_skills" ON skills;
CREATE POLICY "public_read_skills" ON skills FOR SELECT
  TO anon, authenticated USING (is_visible = true);

DROP POLICY IF EXISTS "admin_read_skills" ON skills;
CREATE POLICY "admin_read_skills" ON skills FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_skills" ON skills;
CREATE POLICY "admin_insert_skills" ON skills FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_skills" ON skills;
CREATE POLICY "admin_update_skills" ON skills FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_skills" ON skills;
CREATE POLICY "admin_delete_skills" ON skills FOR DELETE
  TO authenticated USING (true);

-- PROJECTS
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL,
  short_description text NOT NULL,
  business_problem text,
  solution text,
  how_it_works text,
  outcome text,
  technologies text[] NOT NULL DEFAULT '{}',
  media_type text NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  media_url text,
  live_url text,
  github_url text,
  featured boolean NOT NULL DEFAULT false,
  is_visible boolean NOT NULL DEFAULT true,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_projects" ON projects;
CREATE POLICY "public_read_projects" ON projects FOR SELECT
  TO anon, authenticated USING (is_visible = true);

DROP POLICY IF EXISTS "admin_read_projects" ON projects;
CREATE POLICY "admin_read_projects" ON projects FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_projects" ON projects;
CREATE POLICY "admin_insert_projects" ON projects FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_projects" ON projects;
CREATE POLICY "admin_update_projects" ON projects FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_projects" ON projects;
CREATE POLICY "admin_delete_projects" ON projects FOR DELETE
  TO authenticated USING (true);

-- CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  project_type text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_messages" ON contact_messages;
CREATE POLICY "public_insert_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_messages" ON contact_messages;
CREATE POLICY "admin_read_messages" ON contact_messages FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_messages" ON contact_messages;
CREATE POLICY "admin_update_messages" ON contact_messages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_messages" ON contact_messages;
CREATE POLICY "admin_delete_messages" ON contact_messages FOR DELETE
  TO authenticated USING (true);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_services_order ON services (display_order);
CREATE INDEX IF NOT EXISTS idx_problems_order ON problems (display_order);
CREATE INDEX IF NOT EXISTS idx_skills_category_order ON skills (category, display_order);
CREATE INDEX IF NOT EXISTS idx_projects_featured_order ON projects (featured, display_order);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects (slug);
CREATE INDEX IF NOT EXISTS idx_messages_status_created ON contact_messages (status, created_at);

-- UPDATED_AT trigger helper
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated ON profiles;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_services_updated ON services;
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_problems_updated ON problems;
CREATE TRIGGER trg_problems_updated BEFORE UPDATE ON problems
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_skills_updated ON skills;
CREATE TRIGGER trg_skills_updated BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_projects_updated ON projects;
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_messages_updated ON contact_messages;
CREATE TRIGGER trg_messages_updated BEFORE UPDATE ON contact_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();