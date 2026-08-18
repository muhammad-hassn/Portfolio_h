export type Profile = {
  id: string;
  name: string;
  professional_title: string;
  hero_headline: string;
  hero_description: string;
  about: string;
  profile_image_url: string | null;
  email: string;
  location: string;
  availability_text: string;
  github_url: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Service = {
  id: string;
  title: string;
  short_description: string;
  description: string | null;
  icon: string | null;
  cta_text: string | null;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
};

export type Problem = {
  id: string;
  title: string;
  description: string;
  solution: string | null;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
};

export type Skill = {
  id: string;
  name: string;
  category: string;
  icon_url: string | null;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  category: string;
  short_description: string;
  business_problem: string | null;
  solution: string | null;
  how_it_works: string | null;
  outcome: string | null;
  technologies: string[];
  media_type: 'image' | 'video';
  media_url: string | null;
  live_url: string | null;
  github_url: string | null;
  featured: boolean;
  is_visible: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  project_type: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  created_at: string;
  updated_at: string;
};

export const DEFAULT_PROFILE: Profile = {
  id: '',
  name: 'Muhammad Hassan',
  professional_title: 'AI Automation & Full-Stack Developer',
  hero_headline: 'I Build AI-Powered Systems That Help Businesses Work Smarter.',
  hero_description:
    'I help businesses build modern websites, AI applications, automation workflows, APIs and custom software that solve real problems and reduce repetitive work.',
  about:
    'I’m Muhammad Hassan, an AI & Software Engineering developer focused on building practical digital products, automation systems and AI-powered applications. I work across frontend, backend, APIs, databases, automation and AI integration to turn business requirements into working software. My goal is simple: build technology that solves a real problem, saves time, improves workflows or creates a better digital experience. I’m currently completing my BS in Software Engineering at PAF KIET.',
  profile_image_url: null,
  email: 'hello@muhammadhassan.dev',
  location: 'Karachi, Pakistan',
  availability_text: 'Available for freelance projects and collaborations.',
  github_url: 'https://github.com/muhammadhassan',
  linkedin_url: 'https://linkedin.com/in/muhammadhassan',
  website_url: null,
  created_at: '',
  updated_at: '',
};

export const PROJECT_TYPES = [
  'Website',
  'AI Application',
  'Automation',
  'API / Backend',
  'Mobile App',
  'Custom Software',
  'Other',
] as const;

export const SKILL_CATEGORIES = ['AI', 'Web', 'Backend', 'Automation', 'Mobile', 'Database'] as const;
