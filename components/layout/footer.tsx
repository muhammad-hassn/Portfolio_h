import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';
import type { Profile } from '@/lib/types';

export function Footer({ profile }: { profile: Profile }) {
  const email = profile.email || 'm.hassn.2005@gmail.com';
  const github = profile.github_url || 'https://github.com/muhammad-hassn';
  const linkedin = profile.linkedin_url || 'https://www.linkedin.com/in/muhammad-hassan-45129031b/';

  return (
    <footer className="relative border-t border-white/[0.06] bg-[#0A0A0B]">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 font-display text-sm font-bold text-white shadow-sm">
                MH
              </span>
              <span className="font-display text-base font-semibold text-foreground">
                Muhammad Hassan
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Full-Stack & AI Engineer specializing in production-grade web applications, autonomous LLM agents, and scalable cloud architectures.
            </p>
            <p className="mt-3 font-mono text-xs text-muted-foreground/60">
              Islamabad, PK • Global Remote Availability
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Navigation
            </span>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link href="/#work" className="text-muted-foreground transition-colors hover:text-foreground">
                Selected Work
              </Link>
              <Link href="/#capabilities" className="text-muted-foreground transition-colors hover:text-foreground">
                Capabilities
              </Link>
              <Link href="/#tech" className="text-muted-foreground transition-colors hover:text-foreground">
                Tech Stack
              </Link>
              <Link href="/#process" className="text-muted-foreground transition-colors hover:text-foreground">
                Process
              </Link>
              <Link href="/#contact" className="text-muted-foreground transition-colors hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Connect
            </span>
            <div className="flex items-center gap-2.5">
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              <a
                href={`mailto:${email}`}
                aria-label="Email"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
            <Link
              href="/#contact"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
            >
              Book a Strategy Call →
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 text-xs text-muted-foreground/60 md:flex-row">
          <p>© {new Date().getFullYear()} Muhammad Hassan. All rights reserved.</p>
          <p className="font-mono text-[11px]">
            Engineered with Next.js, Three.js, TypeScript & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
