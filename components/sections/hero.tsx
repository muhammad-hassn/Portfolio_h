'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Profile } from '@/lib/types';
import { HeroReveal } from '@/components/motion/motion';
import { HeroVisualization } from './hero-visualization';

export function Hero({ profile }: { profile: Profile }) {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden pt-28 md:pt-36">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-40" />
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-[300px] w-[300px] rounded-full bg-accent-2/10 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid items-center gap-12 pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          {/* Left */}
          <div>
            <HeroReveal delay={0.1}>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground">
                <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
                AI AUTOMATION • FULL-STACK DEVELOPMENT
              </span>
            </HeroReveal>

            <HeroReveal delay={0.2} className="mt-6">
              <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
                {profile.hero_headline}
              </h1>
            </HeroReveal>

            <HeroReveal delay={0.35} className="mt-6">
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
                {profile.hero_description}
              </p>
            </HeroReveal>

            <HeroReveal delay={0.5} className="mt-8">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#contact"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow"
                >
                  Start a Project
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="#problems"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card/50 px-6 py-3 text-sm font-semibold text-foreground transition-all hover:border-primary/50 hover:bg-card"
                >
                  View My Work
                </Link>
              </div>
            </HeroReveal>
          </div>

          {/* Right - visualization */}
          <HeroReveal delay={0.6} className="relative">
            <HeroVisualization reduce={reduce} />
          </HeroReveal>
        </div>
      </div>
    </section>
  );
}
