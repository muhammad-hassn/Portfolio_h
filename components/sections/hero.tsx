'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import type { Profile } from '@/lib/types';
import { HeroReveal } from '@/components/motion/motion';

// Lazy-load 3D scene — no SSR
const HeroScene = dynamic(
  () => import('./hero-scene').then((mod) => mod.HeroScene),
  { ssr: false }
);

export function Hero({ profile }: { profile: Profile }) {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden pt-28 md:pt-36 lg:pt-40">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-30" />
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/6 blur-[140px]" />
        <div className="absolute right-0 top-1/3 h-[300px] w-[300px] rounded-full bg-accent-2/5 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid items-center gap-12 pb-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-4">
          {/* Left — Copy */}
          <div>
            <HeroReveal delay={0.1}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium tracking-wide text-muted-foreground backdrop-blur-sm">
                <span className="flex h-1.5 w-1.5 rounded-full bg-accent-2 animate-pulse-glow" />
                FULL-STACK & AI ENGINEERING
              </span>
            </HeroReveal>

            <HeroReveal delay={0.2} className="mt-7">
              <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tighter text-balance sm:text-5xl lg:text-[3.5rem] xl:text-6xl">
                Hassan {'\u2014'} Full-Stack{' '}
                <span className="text-gradient-accent">&amp; AI</span>{' '}
                Engineer
              </h1>
            </HeroReveal>

            <HeroReveal delay={0.35} className="mt-6">
              <p className="max-w-lg text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
                {profile.hero_description}
              </p>
            </HeroReveal>

            <HeroReveal delay={0.5} className="mt-8">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#work"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow"
                >
                  View Work
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-white/[0.06]"
                >
                  <Calendar className="h-4 w-4" />
                  Book a Call
                </Link>
              </div>
            </HeroReveal>
          </div>

          {/* Right — 3D Scene (desktop) / Gradient fallback (mobile) */}
          <HeroReveal delay={0.6} className="relative">
            {/* Mobile gradient fallback */}
            <div className="block aspect-square w-full max-w-md mx-auto lg:hidden">
              <div className="relative h-full w-full overflow-hidden rounded-3xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent-2/10 animate-gradient-shift" />
                <div className="absolute inset-0 bg-grid opacity-20" />
                <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
              </div>
            </div>

            {/* Desktop 3D scene */}
            <div className="hidden lg:block aspect-square w-full">
              {!reduce && <HeroScene />}
              {reduce && (
                <div className="relative h-full w-full overflow-hidden rounded-3xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent-2/10" />
                  <div className="absolute inset-0 bg-grid opacity-20" />
                </div>
              )}
            </div>
          </HeroReveal>
        </div>
      </div>
    </section>
  );
}
