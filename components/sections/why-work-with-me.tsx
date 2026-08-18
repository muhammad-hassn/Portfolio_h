'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { FadeUp, Stagger, StaggerItem } from '@/components/motion/motion';

const REASONS = [
  {
    title: 'Business-Focused Development',
    description: 'I focus on what the software needs to accomplish, not just the technology behind it.',
  },
  {
    title: 'Full-Stack Capability',
    description: 'I can work across frontend, backend, database, APIs and automation layers.',
  },
  {
    title: 'AI + Automation',
    description: 'AI can be integrated directly into practical business workflows instead of being added as a gimmick.',
  },
  {
    title: 'Direct Communication',
    description: 'Clients communicate directly with the developer building the system.',
  },
  {
    title: 'Flexible Solutions',
    description: 'Solutions are designed around the client\u2019s workflow rather than forcing the business into a generic template.',
  },
];

export function WhyWorkWithMe() {
  return (
    <section id="why" className="relative scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <FadeUp className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Why Work With Me
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Why Work With Me
          </h2>
        </FadeUp>

        <Stagger staggerChildren={0.1} className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason, i) => (
            <StaggerItem key={reason.title}>
              <ReasonCard reason={reason} index={i} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function ReasonCard({ reason, index }: { reason: { title: string; description: string }; index: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      whileHover={reduce ? {} : { y: -3 }}
      transition={{ duration: 0.3 }}
      className="group relative flex h-full flex-col rounded-2xl border border-border bg-card/30 p-6 transition-colors hover:border-primary/30"
    >
      <span className="font-display text-3xl font-bold text-muted-foreground/15 transition-colors group-hover:text-primary/20">
        {String(index + 1).padStart(2, '0')}
      </span>
      <h3 className="mt-3 font-display text-base font-semibold tracking-tight">
        {reason.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {reason.description}
      </p>
    </motion.div>
  );
}
