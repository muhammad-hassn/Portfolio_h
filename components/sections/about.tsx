'use client';

import Image from 'next/image';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';
import type { Profile } from '@/lib/types';
import { FadeUp } from '@/components/motion/motion';

export function About({ profile }: { profile: Profile }) {
  return (
    <section id="about" className="relative scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* Profile image */}
          <FadeUp className="relative mx-auto max-w-sm lg:mx-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-card">
              {profile.profile_image_url ? (
                <Image
                  src={profile.profile_image_url}
                  alt={profile.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 400px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-card via-background to-background-soft">
                  <span className="font-display text-6xl font-bold text-muted-foreground/20">
                    MH
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
            </div>
            <div className="absolute -bottom-4 -right-4 rounded-xl border border-border bg-card/80 p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-success animate-pulse-glow" />
                <span className="text-xs font-medium text-muted-foreground">
                  {profile.availability_text}
                </span>
              </div>
            </div>
          </FadeUp>

          {/* About text */}
          <FadeUp delay={0.15}>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              About
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              About
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground text-pretty">
              {profile.about}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {['AI', 'Automation', 'Full-Stack', 'APIs', 'Custom Software'].map((cap) => (
                <span
                  key={cap}
                  className="rounded-lg border border-border bg-card/40 px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {cap}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Github className="h-4 w-4" /> GitHub
                </a>
              )}
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              )}
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4" /> {profile.email}
              </a>
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" /> {profile.location}
              </span>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
