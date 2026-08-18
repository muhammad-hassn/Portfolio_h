'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FolderKanban, Star, Briefcase, Mail, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function AdminOverview() {
  const [stats, setStats] = useState({ projects: 0, featured: 0, services: 0, unread: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [projects, services, messages] = await Promise.all([
        supabase.from('projects').select('id, featured'),
        supabase.from('services').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('status', 'unread'),
      ]);

      setStats({
        projects: projects.data?.length ?? 0,
        featured: projects.data?.filter((p) => p.featured).length ?? 0,
        services: services.count ?? 0,
        unread: messages.count ?? 0,
      });
      setLoading(false);
    })();
  }, []);

  const cards = [
    { label: 'Projects', value: stats.projects, icon: FolderKanban, href: '/admin/projects', color: 'text-primary' },
    { label: 'Featured Projects', value: stats.featured, icon: Star, href: '/admin/projects', color: 'text-warning' },
    { label: 'Services', value: stats.services, icon: Briefcase, href: '/admin/services', color: 'text-accent-2' },
    { label: 'Unread Messages', value: stats.unread, icon: Mail, href: '/admin/messages', color: 'text-destructive' },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight">Overview</h1>
      <p className="mt-1 text-sm text-muted-foreground">A quick snapshot of your portfolio.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group rounded-2xl border border-border bg-card/40 p-5 transition-colors hover:border-primary/30"
            >
              <div className="flex items-center justify-between">
                <Icon className={`h-5 w-5 ${card.color}`} />
                <ArrowRight className="h-4 w-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="mt-4 font-display text-3xl font-bold">
                {loading ? '—' : card.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{card.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card/30 p-6">
        <h2 className="font-display text-base font-semibold">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/projects" className="rounded-lg border border-border bg-card/50 px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40">
            Manage Projects
          </Link>
          <Link href="/admin/services" className="rounded-lg border border-border bg-card/50 px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40">
            Edit Services
          </Link>
          <Link href="/admin/profile" className="rounded-lg border border-border bg-card/50 px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40">
            Update Profile
          </Link>
          <Link href="/admin/messages" className="rounded-lg border border-border bg-card/50 px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40">
            Check Messages
          </Link>
        </div>
      </div>
    </div>
  );
}
