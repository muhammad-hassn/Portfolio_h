'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { Skill } from '@/lib/types';
import { FadeUp } from '@/components/motion/motion';
import { SKILL_CATEGORIES } from '@/lib/types';

export function TechStack({ skills }: { skills: Skill[] }) {
  const [active, setActive] = useState<string>('all');
  const reduce = useReducedMotion();

  const categories = ['all', ...SKILL_CATEGORIES];
  const filtered = active === 'all' ? skills : skills.filter((s) => s.category === active);

  return (
    <section id="tech" className="relative scroll-mt-20 border-t border-border/40 bg-background-soft/30 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <FadeUp className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Technology
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Technology I Use
          </h2>
          <p className="mt-4 text-base text-muted-foreground text-pretty">
            A focused toolkit for building reliable, production-ready systems.
          </p>
        </FadeUp>

        {/* Category tabs */}
        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-lg border px-3.5 py-1.5 text-sm font-medium capitalize transition-all ${
                active === cat
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-card/40 text-muted-foreground hover:border-primary/30 hover:text-foreground'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>

        {/* Skills grid */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((skill, i) => (
              <motion.div
                key={skill.id}
                layout
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card/40 p-4 transition-colors hover:border-primary/30"
              >
                <span className="font-display text-sm font-semibold tracking-tight">
                  {skill.name}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60">
                  {skill.category}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
