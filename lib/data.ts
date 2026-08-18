import { supabase } from './supabase/client';
import type { Profile, Service, Problem, Skill, Project, ContactMessage } from './types';
import { DEFAULT_PROFILE } from './types';

export async function getProfile(): Promise<Profile> {
  const { data } = await supabase.from('profiles').select('*').maybeSingle();
  return data ?? DEFAULT_PROFILE;
}

export async function getServices(): Promise<Service[]> {
  const { data } = await supabase
    .from('services')
    .select('*')
    .order('display_order', { ascending: true });
  return (data ?? []).filter((s) => s.is_visible);
}

export async function getProblems(): Promise<Problem[]> {
  const { data } = await supabase
    .from('problems')
    .select('*')
    .order('display_order', { ascending: true });
  return (data ?? []).filter((p) => p.is_visible);
}

export async function getSkills(): Promise<Skill[]> {
  const { data } = await supabase
    .from('skills')
    .select('*')
    .order('display_order', { ascending: true });
  return (data ?? []).filter((s) => s.is_visible);
}

export async function getProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .order('featured', { ascending: false })
    .order('display_order', { ascending: true });
  return (data ?? []).filter((p) => p.is_visible);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data } = await supabase.from('projects').select('*').eq('slug', slug).maybeSingle();
  return data;
}

export async function getAllProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .order('featured', { ascending: false })
    .order('display_order', { ascending: true });
  return data ?? [];
}

export async function getMessages(): Promise<ContactMessage[]> {
  const { data } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  return data ?? [];
}

export async function getUnreadMessageCount(): Promise<number> {
  const { count } = await supabase
    .from('contact_messages')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'unread');
  return count ?? 0;
}
