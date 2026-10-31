'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { FadeUp } from '@/components/motion/motion';
import { Compass, Layers, Cpu, Rocket } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    icon: Compass,
    title: 'Architecture & Scope',
    description:
      'We clarify objectives, define database schemas, select the right tech stack, and map out clear product milestones.',
  },
  {
    number: '02',
    icon: Layers,
    title: 'Rapid Prototyping',
    description:
      'Functional prototypes and UI proofs-of-concept are built early to stress-test UX, user flows, and core assumptions.',
  },
  {
    number: '03',
    icon: Cpu,
    title: 'Production Engineering',
    description:
      'Clean, typed, maintainable code with automated test coverage, strict error handling, and performance optimization.',
  },
  {
    number: '04',
    icon: Rocket,
    title: 'Deployment & Observability',
    description:
      'Zero-downtime deployment, serverless scaling, monitoring setup, and thorough documentation for effortless operation.',
  },
];

export function Process() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end center'],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="process" className="relative scroll-mt-20 py-14 sm:py-20 md:py-28 lg:py-32 border-t border-white/[0.04]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeUp className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Methodology
          </span>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Engineering Process
          </h2>
          <p className="mt-3 sm:mt-4 text-[15px] sm:text-base leading-relaxed text-muted-foreground text-pretty">
            A disciplined, transparent delivery framework engineered to ship production software reliably.
          </p>
        </FadeUp>

        {/* Desktop timeline (md+) */}
        <div ref={ref} className="relative mt-16 hidden md:block">
          <div className="absolute left-0 right-0 top-10 h-[2px] bg-white/[0.06]" />
          <motion.div
            className="absolute left-0 top-10 h-[2px] origin-left bg-gradient-to-r from-primary via-indigo-400 to-emerald-400"
            style={reduce ? { width: '100%' } : { scaleX: lineScale }}
          />
          <div className="grid grid-cols-4 gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="group relative pt-4"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-background text-muted-foreground shadow-sm transition-all group-hover:border-primary/50 group-hover:text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="mt-6">
                    <span className="font-mono text-xs font-semibold text-primary">
                      PHASE {step.number}
                    </span>
                    <h3 className="mt-1 font-display text-lg font-semibold tracking-tight text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile timeline (< md) */}
        <div className="mt-8 space-y-3.5 sm:space-y-4 md:hidden">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className="relative flex items-start gap-3.5 sm:gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5 backdrop-blur-sm"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-primary font-semibold">
                    Phase {step.number}
                  </span>
                  <h3 className="mt-0.5 font-display text-sm sm:text-base font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
