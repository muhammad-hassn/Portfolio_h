'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { Problem } from '@/lib/types';
import { FadeUp, Stagger, StaggerItem } from '@/components/motion/motion';

export function Problems({ problems }: { problems: Problem[] }) {
  return (
    <section id="problems" className="relative scroll-mt-20 border-t border-border/40 bg-background-soft/30 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <FadeUp className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Problems I Solve
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            What Can I Help You Automate or Build?
          </h2>
          <p className="mt-4 text-base text-muted-foreground text-pretty">
            If any of these sound familiar, there's a good chance I can help.
          </p>
        </FadeUp>

        <Stagger staggerChildren={0.08} className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem, i) => (
            <StaggerItem key={problem.id}>
              <ProblemCard problem={problem} index={i} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function ProblemCard({ problem, index }: { problem: Problem; index: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      whileHover={reduce ? {} : { y: -3 }}
      transition={{ duration: 0.3 }}
      className="group relative flex h-full flex-col rounded-2xl border border-border bg-card/30 p-6 transition-colors hover:border-primary/30"
    >
      <span className="font-mono text-xs font-medium text-muted-foreground/50">
        {String(index + 1).padStart(2, '0')}
      </span>
      <h3 className="mt-3 font-display text-base font-semibold tracking-tight">
        {problem.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {problem.description}
      </p>
      {problem.solution && (
        <div className="mt-4 border-t border-border/60 pt-4">
          <p className="text-xs leading-relaxed text-muted-foreground/80">
            <span className="font-semibold text-primary/80">Solution: </span>
            {problem.solution}
          </p>
        </div>
      )}
    </motion.div>
  );
}
