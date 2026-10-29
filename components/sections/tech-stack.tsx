'use client';

import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Skill } from '@/lib/types';
import { FadeUp } from '@/components/motion/motion';

const CURATED_STACK = [
  { name: 'Next.js 14', category: 'framework' },
  { name: 'TypeScript', category: 'language' },
  { name: 'React', category: 'frontend' },
  { name: 'Python', category: 'language' },
  { name: 'Node.js', category: 'backend' },
  { name: 'PostgreSQL', category: 'database' },
  { name: 'Tailwind CSS', category: 'frontend' },
  { name: 'OpenAI / Claude', category: 'ai' },
  { name: 'LangChain', category: 'ai' },
  { name: 'Docker', category: 'devops' },
  { name: 'Supabase', category: 'backend' },
  { name: 'Redis', category: 'database' },
  { name: 'React Native', category: 'mobile' },
  { name: 'GraphQL / REST', category: 'api' },
  { name: 'Three.js / WebGL', category: 'graphics' },
  { name: 'Git & GitHub CI', category: 'devops' },
];

export function TechStack({ skills }: { skills: Skill[] }) {
  const reduce = useReducedMotion();

  // Combine prop skills with curated stack
  const stackItems = useMemo(() => {
    if (skills && skills.length > 0) {
      return skills.map((s) => ({ name: s.name, category: s.category }));
    }
    return CURATED_STACK;
  }, [skills]);

  // Duplicate items for continuous marquee
  const row1 = stackItems.slice(0, Math.ceil(stackItems.length / 2));
  const row2 = stackItems.slice(Math.ceil(stackItems.length / 2));

  return (
    <section id="tech" className="relative scroll-mt-20 py-24 md:py-32 border-t border-white/[0.04] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <FadeUp className="max-w-2xl text-center mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Technologies
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Modern Engineering Stack
          </h2>
          <p className="mt-4 text-base text-muted-foreground text-pretty">
            A production-proven toolkit chosen for reliability, high performance, and rapid execution.
          </p>
        </FadeUp>
      </div>

      {/* Marquee Containers */}
      <div className="mt-14 relative w-full space-y-4">
        {/* Left & Right gradient masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-background to-transparent z-10" />

        {/* Row 1: Leftward continuous scroll */}
        <div className="flex w-full overflow-hidden select-none">
          <motion.div
            className="flex gap-3 shrink-0 items-center py-1"
            animate={reduce ? {} : { x: ['0%', '-50%'] }}
            transition={{
              duration: 35,
              ease: 'linear',
              repeat: Infinity,
            }}
          >
            {[...row1, ...row1, ...row1, ...row1].map((item, idx) => (
              <div
                key={`r1-${item.name}-${idx}`}
                className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-white/[0.05]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="font-display text-sm font-semibold tracking-tight text-foreground">
                  {item.name}
                </span>
                <span className="font-mono text-[10px] uppercase text-muted-foreground/60">
                  {item.category}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Row 2: Rightward continuous scroll */}
        <div className="flex w-full overflow-hidden select-none">
          <motion.div
            className="flex gap-3 shrink-0 items-center py-1"
            animate={reduce ? {} : { x: ['-50%', '0%'] }}
            transition={{
              duration: 35,
              ease: 'linear',
              repeat: Infinity,
            }}
          >
            {[...row2, ...row2, ...row2, ...row2].map((item, idx) => (
              <div
                key={`r2-${item.name}-${idx}`}
                className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 backdrop-blur-sm transition-colors hover:border-emerald-500/40 hover:bg-white/[0.05]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="font-display text-sm font-semibold tracking-tight text-foreground">
                  {item.name}
                </span>
                <span className="font-mono text-[10px] uppercase text-muted-foreground/60">
                  {item.category}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
