import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';
import type { Profile } from '@/lib/types';

export function Footer({ profile }: { profile: Profile }) {
  return (
    <footer className="relative border-t border-border/60 bg-background-soft">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent-2 font-display text-sm font-bold text-white">
                MH
              </span>
              <span className="font-display text-base font-semibold">Muhammad Hassan</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {profile.professional_title}
            </p>
            <p className="mt-2 text-xs text-muted-foreground/70">
              AI • Automation • Web • APIs • Custom Software
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Navigation
            </span>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/#services" className="text-muted-foreground transition-colors hover:text-foreground">Services</Link>
              <Link href="/#work" className="text-muted-foreground transition-colors hover:text-foreground">Work</Link>
              <Link href="/#process" className="text-muted-foreground transition-colors hover:text-foreground">Process</Link>
              <Link href="/#about" className="text-muted-foreground transition-colors hover:text-foreground">About</Link>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Connect
            </span>
            <div className="flex items-center gap-3">
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
            <Link
              href="/#contact"
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
            >
              Start a Project →
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground/60 md:flex-row">
          <p>© {new Date().getFullYear()} Muhammad Hassan. All rights reserved.</p>
          <p>Built with Next.js, Supabase & Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  );
}
