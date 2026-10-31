'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, Calendar } from 'lucide-react';
import type { Profile } from '@/lib/types';
import { HeroReveal } from '@/components/motion/motion';
import { HeroPosterFallback } from './hero-scene';

// Lazy-load 3D scene with ssr: false and zero-layout-shift poster fallback
const HeroScene = dynamic(
  () => import('./hero-scene').then((mod) => mod.HeroScene),
  {
    ssr: false,
    loading: () => <HeroPosterFallback />,
  }
);

export function Hero({ profile }: { profile: Profile }) {
  return (
    <section className="relative overflow-hidden pt-24 pb-12 px-5 sm:px-6 md:pt-36 md:pb-20 lg:pt-40">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-25" />
        <div className="absolute left-1/2 top-0 h-[450px] sm:h-[600px] w-[600px] sm:w-[900px] -translate-x-1/2 rounded-full bg-primary/8 blur-[120px] sm:blur-[140px]" />
        <div className="absolute right-0 top-1/3 h-[220px] sm:h-[300px] w-[220px] sm:w-[300px] rounded-full bg-accent-2/5 blur-[90px] sm:blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-4 lg:pb-20">
          {/* Top/Left — Hero Copy (Mobile: single column, fold-friendly on 390x844) */}
          <div className="flex flex-col text-left">
            {/* 1. Badge */}
            <HeroReveal delay={0.1}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium tracking-wider text-muted-foreground uppercase backdrop-blur-sm">
                <span className="flex h-1.5 w-1.5 rounded-full bg-accent-2 animate-pulse-glow" />
                FULL-STACK &amp; AI ENGINEERING
              </span>
            </HeroReveal>

            {/* 2. H1: font-size clamp(2rem, 9vw, 2.75rem), leading-[1.1], tracking-tight, unbreakable Full-Stack */}
            <HeroReveal delay={0.2} className="mt-4">
              <h1 className="font-display text-[clamp(2rem,9vw,2.75rem)] sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold leading-[1.1] tracking-tight text-balance">
                Hassan {'\u2014'}{' '}
                <span className="whitespace-nowrap">Full&#8209;Stack</span>{' '}
                <span className="text-gradient-accent">&amp; AI</span>{' '}
                Engineer
              </h1>
            </HeroReveal>

            {/* 3. Subtext: text-[15px], leading-relaxed, text-white/70, max-w-[34ch] on mobile */}
            <HeroReveal delay={0.35} className="mt-3">
              <p className="max-w-[34ch] sm:max-w-xl text-[15px] sm:text-base md:text-lg leading-relaxed text-white/70 text-pretty">
                {profile.hero_description}
              </p>
            </HeroReveal>

            {/* 4. CTAs: Stacked with clear hierarchy on mobile */}
            <HeroReveal delay={0.5} className="mt-6">
              <div className="flex flex-col gap-3 sm:flex-row w-full sm:w-auto">
                {/* Primary CTA: solid accent, subtle glow shadow, min 48px height */}
                <Link
                  href="#work"
                  className="group inline-flex h-12 min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-glow-sm transition-all hover:shadow-glow active:scale-[0.98]"
                >
                  <span>View Work</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>

                {/* Secondary CTA: ghost button, border white/10, bg transparent, min 48px height */}
                <Link
                  href="#contact"
                  className="inline-flex h-12 min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/10 bg-transparent hover:bg-white/[0.04] px-6 text-sm font-semibold text-foreground backdrop-blur-sm transition-all active:scale-[0.98]"
                >
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Book a Call</span>
                </Link>
              </div>
            </HeroReveal>

            {/* 5. Trust Strip: Chhota inline capabilities strip */}
            <HeroReveal delay={0.55} className="mt-5">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-muted-foreground/80">
                <span className="rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-white/70 backdrop-blur-sm">
                  Web Applications
                </span>
                <span className="text-white/20">·</span>
                <span className="rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-white/70 backdrop-blur-sm">
                  AI Systems
                </span>
                <span className="text-white/20">·</span>
                <span className="rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-white/70 backdrop-blur-sm">
                  Cloud &amp; Mobile
                </span>
              </div>
            </HeroReveal>
          </div>

          {/* 6. 3D Showcase Card: Aspect [4/3], ~70% 3D fill, 3 floating chips */}
          <HeroReveal delay={0.6} className="relative w-full mt-7 lg:mt-0">
            <div className="relative mx-auto w-full aspect-[4/3] sm:h-[340px] lg:h-[480px] xl:h-[520px] lg:aspect-auto overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm shadow-2xl">
              {/* Radial glow in card background */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/25 via-primary/5 to-transparent blur-2xl" />

              {/* 3 Floating Tech Chips (over canvas, pointer-events-none) */}
              <div className="pointer-events-none absolute left-3.5 top-3.5 sm:left-4 sm:top-4 z-10 animate-float-chip-1">
                <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-[11px] font-mono font-medium text-white/90 backdrop-blur-md shadow-lg">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  Next.js
                </div>
              </div>

              <div className="pointer-events-none absolute right-3.5 top-4 sm:right-4 sm:top-5 z-10 animate-float-chip-2">
                <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-[11px] font-mono font-medium text-white/90 backdrop-blur-md shadow-lg">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  FastAPI
                </div>
              </div>

              <div className="pointer-events-none absolute left-4 bottom-3.5 sm:left-5 sm:bottom-4 z-10 animate-float-chip-3">
                <div className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-[11px] font-mono font-medium text-white/90 backdrop-blur-md shadow-lg">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  n8n
                </div>
              </div>

              {/* 3D Scene */}
              <HeroScene />
            </div>
          </HeroReveal>
        </div>
      </div>

      {/* 7. Bottom subtle gradient fade into next section */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
