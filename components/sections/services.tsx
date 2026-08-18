'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import type { Service } from '@/lib/types';
import { FadeUp, Stagger, StaggerItem } from '@/components/motion/motion';

export function Services({ services }: { services: Service[] }) {
  return (
    <section id="services" className="relative scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <FadeUp className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Services
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            What I Can Build For Your Business
          </h2>
          <p className="mt-4 text-base text-muted-foreground text-pretty">
            From AI-powered tools to full-stack applications, I deliver software that solves real business problems.
          </p>
        </FadeUp>

        <Stagger
          staggerChildren={0.1}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, i) => (
            <StaggerItem key={service.id}>
              <ServiceCard service={service} index={i} />
            </StaggerItem>
          ))}
        </Stagger>

        <FadeUp delay={0.2} className="mt-12">
          <div className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-card/40 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h3 className="font-display text-lg font-semibold">
                Have a business problem you'd like to automate?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Let's talk about what you're trying to solve.
              </p>
            </div>
            <Link
              href="#contact"
              className="group inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-semibold transition-all hover:border-primary/50 hover:bg-card/80"
            >
              Let's Discuss It
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const reduce = useReducedMotion();
  const Icon = service.icon
    ? (Icons as any)[service.icon] ?? Icons.Code
    : Icons.Code;

  return (
    <motion.div
      whileHover={reduce ? {} : { y: -4 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card/40 p-6 transition-colors hover:border-primary/30"
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/5 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-medium text-muted-foreground/60">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/50 transition-colors group-hover:border-primary/40">
          <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
        </div>
      </div>

      <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">
        {service.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {service.short_description}
      </p>

      <Link
        href="#contact"
        className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
      >
        {service.cta_text ?? 'Learn More'}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </Link>
    </motion.div>
  );
}
