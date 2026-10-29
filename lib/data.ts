import { supabase } from './supabase/client';
import type { Profile, Service, Problem, Skill, Project, ContactMessage } from './types';
import { DEFAULT_PROFILE } from './types';
import fallbackProjectsData from './fallback-projects.json';

const FALLBACK_PROJECTS: Project[] = fallbackProjectsData as Project[];

export async function getProfile(): Promise<Profile> {
  try {
    const { data, error } = await supabase.from('profiles').select('*').maybeSingle();
    if (!error && data) return data;
  } catch (err) {
    console.error('getProfile error:', err);
  }
  return DEFAULT_PROFILE;
}

export async function getServices(): Promise<Service[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true });
    if (!error && data && data.length > 0) {
      return data.filter((s) => s.is_visible);
    }
  } catch (err) {
    console.error('getServices error:', err);
  }
  return [];
}

export async function getProblems(): Promise<Problem[]> {
  try {
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .order('display_order', { ascending: true });
    if (!error && data && data.length > 0) {
      return data.filter((p) => p.is_visible);
    }
  } catch (err) {
    console.error('getProblems error:', err);
  }
  return [];
}

export async function getSkills(): Promise<Skill[]> {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('display_order', { ascending: true });
    if (!error && data && data.length > 0) {
      return data.filter((s) => s.is_visible);
    }
  } catch (err) {
    console.error('getSkills error:', err);
  }
  return [];
}

export async function getProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('featured', { ascending: false })
      .order('display_order', { ascending: true });

    if (!error && data && data.length > 0) {
      const visible = data.filter((p) => p.is_visible);
      if (visible.length > 0) return visible;
    }
  } catch (err) {
    console.error('getProjects error:', err);
  }
  return FALLBACK_PROJECTS;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (!error && data) return data;
  } catch (err) {
    console.error('getProjectBySlug error:', err);
  }
  const fallback = FALLBACK_PROJECTS.find((p) => p.slug === slug);
  return fallback ?? null;
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('featured', { ascending: false })
      .order('display_order', { ascending: true });

    if (!error && data && data.length > 0) return data;
  } catch (err) {
    console.error('getAllProjects error:', err);
  }
  return FALLBACK_PROJECTS;
}

export async function getMessages(): Promise<ContactMessage[]> {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) return data;
  } catch (err) {
    console.error('getMessages error:', err);
  }
  return [];
}

export async function getUnreadMessageCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('contact_messages')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'unread');
    if (!error && count !== null) return count;
  } catch (err) {
    console.error('getUnreadMessageCount error:', err);
  }
  return 0;
}
