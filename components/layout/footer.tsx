import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';
import type { Profile } from '@/lib/types';

export function Footer({ profile }: { profile: Profile }) {
  const email = profile.email || 'muhammadhassanmh4080@gmail.com';
  const github = profile.github_url || 'https://github.com/muhammad-hassn';
  const linkedin = profile.linkedin_url || 'https://www.linkedin.com/in/muhammad-hassan-31a43a319/';

  return (
    <footer className="relative border-t border-white/[0.06] bg-[#0A0A0B]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16 md:px-6">
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
            <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Full-Stack &amp; AI Engineer specializing in production-grade web applications, autonomous LLM agents, and scalable cloud architectures.
            </p>
            <p className="mt-2.5 font-mono text-[11px] sm:text-xs text-muted-foreground/60">
              Karachi, Pakistan • Global Remote Availability
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Navigation
            </span>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/#about" className="py-1 text-muted-foreground transition-colors hover:text-foreground active:text-primary">
                About
              </Link>
              <Link href="/#work" className="py-1 text-muted-foreground transition-colors hover:text-foreground active:text-primary">
                Selected Work
              </Link>
              <Link href="/#capabilities" className="py-1 text-muted-foreground transition-colors hover:text-foreground active:text-primary">
                Capabilities
              </Link>
              <Link href="/#tech" className="py-1 text-muted-foreground transition-colors hover:text-foreground active:text-primary">
                Tech Stack
              </Link>
              <Link href="/#process" className="py-1 text-muted-foreground transition-colors hover:text-foreground active:text-primary">
                Process
              </Link>
              <Link href="/#contact" className="py-1 text-muted-foreground transition-colors hover:text-foreground active:text-primary">
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
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground active:scale-95"
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
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground active:scale-95"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              <a
                href={`mailto:${email}`}
                aria-label="Email"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground active:scale-95"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/923408062138?text=Hi%20Hassan%2C%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project."
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground active:scale-95"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            </div>
            <Link
              href="/#contact"
              className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary/80 active:scale-95"
            >
              Book a Strategy Call →
            </Link>
          </div>
        </div>

        <div className="mt-10 sm:mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 sm:pt-8 text-xs text-muted-foreground/60 md:flex-row text-center md:text-left">
          <p>© {new Date().getFullYear()} Muhammad Hassan. All rights reserved.</p>
          <p className="font-mono text-[11px]">
            Engineered with Next.js, Three.js, TypeScript &amp; Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
