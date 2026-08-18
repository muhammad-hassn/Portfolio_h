'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { FadeUp } from '@/components/motion/motion';

const STEPS = [
  {
    number: '01',
    title: 'Understand',
    description: 'We identify the business problem, requirements and desired outcome.',
  },
  {
    number: '02',
    title: 'Plan',
    description: 'I define the solution, technology and development scope.',
  },
  {
    number: '03',
    title: 'Build',
    description: 'I develop, test and integrate the system.',
  },
  {
    number: '04',
    title: 'Launch',
    description: 'The finished solution is deployed and handed over with the required documentation and support.',
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
    <section id="process" className="relative scroll-mt-20 border-t border-border/40 bg-background-soft/30 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <FadeUp className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Process
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            How I Work
          </h2>
          <p className="mt-4 text-base text-muted-foreground text-pretty">
            A clear, structured process from first conversation to launch.
          </p>
        </FadeUp>

        {/* Desktop timeline */}
        <div ref={ref} className="relative mt-16 hidden md:block">
          <div className="absolute left-0 right-0 top-8 h-[2px] bg-border" />
          <motion.div
            className="absolute left-0 top-8 h-[2px] origin-left bg-gradient-to-r from-primary to-accent-2"
            style={reduce ? { width: '100%' } : { scaleX: lineScale }}
          />
          <div className="grid grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-border bg-card font-display text-lg font-bold text-muted-foreground">
                  {step.number}
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile timeline */}
        <div className="mt-12 space-y-6 md:hidden">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative flex gap-4"
            >
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-border bg-card font-display text-sm font-bold text-muted-foreground">
                  {step.number}
                </div>
                {i < STEPS.length - 1 && <div className="mt-2 w-[2px] flex-1 bg-border" />}
              </div>
              <div className="pb-4">
                <h3 className="font-display text-base font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
