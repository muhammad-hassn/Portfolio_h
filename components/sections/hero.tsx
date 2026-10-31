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
    <section className="relative overflow-hidden pt-24 pb-12 sm:pt-28 sm:pb-16 md:pt-36 md:pb-20 lg:pt-40">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-25" />
        <div className="absolute left-1/2 top-0 h-[450px] sm:h-[600px] w-[600px] sm:w-[900px] -translate-x-1/2 rounded-full bg-primary/8 blur-[120px] sm:blur-[140px]" />
        <div className="absolute right-0 top-1/3 h-[220px] sm:h-[300px] w-[220px] sm:w-[300px] rounded-full bg-accent-2/5 blur-[90px] sm:blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-8 pb-10 sm:gap-12 sm:pb-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-4 lg:pb-20">
          {/* Top/Left — Hero Copy (Always appears first on mobile) */}
          <div className="flex flex-col text-left">
            <HeroReveal delay={0.1}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium tracking-wide text-muted-foreground backdrop-blur-sm">
                <span className="flex h-1.5 w-1.5 rounded-full bg-accent-2 animate-pulse-glow" />
                FULL-STACK &amp; AI ENGINEERING
              </span>
            </HeroReveal>

            <HeroReveal delay={0.2} className="mt-5 sm:mt-7">
              <h1 className="font-display text-[2.15rem] leading-[1.08] font-bold tracking-tight text-balance sm:text-5xl lg:text-[3.5rem] xl:text-6xl">
                Hassan {'\u2014'} Full-Stack{' '}
                <span className="text-gradient-accent">&amp; AI</span>{' '}
                Engineer
              </h1>
            </HeroReveal>

            <HeroReveal delay={0.35} className="mt-4 sm:mt-6">
              <p className="max-w-xl text-[15px] sm:text-base md:text-lg leading-relaxed text-muted-foreground text-pretty">
                {profile.hero_description}
              </p>
            </HeroReveal>

            <HeroReveal delay={0.5} className="mt-7 sm:mt-8">
              <div className="flex flex-col gap-3 sm:flex-row w-full sm:w-auto">
                <Link
                  href="#work"
                  className="group inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow-sm transition-all hover:shadow-glow active:scale-[0.98]"
                >
                  View Work
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="#contact"
                  className="inline-flex min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-white/[0.06] active:scale-[0.98]"
                >
                  <Calendar className="h-4 w-4" />
                  Book a Call
                </Link>
              </div>
            </HeroReveal>
          </div>

          {/* Bottom/Right — 3D Scene (Mobile: underneath copy, fixed height, touch-action safe) */}
          <HeroReveal delay={0.6} className="relative w-full">
            <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none h-[270px] sm:h-[340px] lg:h-[480px] xl:h-[520px] overflow-hidden rounded-2xl sm:rounded-3xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent backdrop-blur-sm">
              <HeroScene />
            </div>
          </HeroReveal>
        </div>
      </div>
    </section>
  );
}
