'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Code2, Cpu, Smartphone, CheckCircle2 } from 'lucide-react';
import { FadeUp, Stagger, StaggerItem } from '@/components/motion/motion';
import type { Service } from '@/lib/types';
import { useState, useEffect } from 'react';

interface CapabilitiesProps {
  services?: Service[];
}

const DEFAULT_CAPABILITIES = [
  {
    id: 'full-stack',
    title: 'Full-Stack Engineering',
    tagline: 'Modern, high-performance web applications built for scale.',
    icon: Code2,
    accent: 'from-indigo-500/20 to-indigo-500/0',
    borderHover: 'hover:border-indigo-500/40',
    tags: ['Next.js 14', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'REST & GraphQL'],
    features: [
      'Interactive, high-converting web apps with App Router & Server Components',
      'Scalable backend architecture, secure authentication, and database modeling',
      'Pixel-perfect responsive interfaces with fluid micro-interactions',
    ],
  },
  {
    id: 'ai-systems',
    title: 'AI & LLM Systems',
    tagline: 'Production-ready AI workflows, autonomous agents, and RAG pipelines.',
    icon: Cpu,
    accent: 'from-emerald-500/20 to-emerald-500/0',
    borderHover: 'hover:border-emerald-500/40',
    tags: ['OpenAI', 'Anthropic Claude', 'RAG Pipelines', 'LangChain', 'Vector DBs', 'Custom Agents'],
    features: [
      'Retrieval-Augmented Generation (RAG) over proprietary company knowledge',
      'Autonomous workflow automation & multi-tool AI assistants',
      'Cost-optimized model routing, prompt engineering, and guardrails',
    ],
  },
  {
    id: 'cloud-mobile',
    title: 'Mobile & Cloud Architecture',
    tagline: 'Cross-platform mobile apps and resilient cloud infrastructure.',
    icon: Smartphone,
    accent: 'from-cyan-500/20 to-cyan-500/0',
    borderHover: 'hover:border-cyan-500/40',
    tags: ['React Native', 'Flutter', 'Docker', 'AWS / Vercel', 'Supabase', 'CI/CD Pipelines'],
    features: [
      'Native-feel iOS and Android applications with unified codebases',
      'Automated deployment pipelines, containerization, and monitoring',
      'Reliable serverless architectures with near-zero cold-starts',
    ],
  },
];

export function Capabilities({ services }: CapabilitiesProps) {
  const reduce = useReducedMotion();
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    setCanHover(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, []);

  return (
    <section id="capabilities" className="relative scroll-mt-20 py-14 sm:py-20 md:py-28 lg:py-32 border-t border-white/[0.04]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeUp className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Capabilities
          </span>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Engineering Capabilities
          </h2>
          <p className="mt-3 sm:mt-4 text-[15px] sm:text-base leading-relaxed text-muted-foreground text-pretty">
            I help startups and forward-thinking companies build, launch, and scale high-impact digital products.
          </p>
        </FadeUp>

        <Stagger staggerChildren={0.15} className="mt-8 sm:mt-14 grid gap-5 sm:gap-6 lg:grid-cols-3">
          {DEFAULT_CAPABILITIES.map((cap) => {
            const Icon = cap.icon;
            return (
              <StaggerItem key={cap.id}>
                <motion.div
                  whileHover={reduce || !canHover ? {} : { y: -6 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 sm:p-7 backdrop-blur-sm transition-all duration-300 active:scale-[0.99] ${cap.borderHover}`}
                >
                  {/* Subtle top glow */}
                  <div
                    className={`pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-gradient-to-b ${cap.accent} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100`}
                  />

                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <span className="font-mono text-[11px] sm:text-xs text-muted-foreground/60">
                        STUDIO SPEC
                      </span>
                    </div>

                    <h3 className="mt-5 sm:mt-6 font-display text-lg sm:text-xl font-semibold tracking-tight text-foreground">
                      {cap.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {cap.tagline}
                    </p>

                    <div className="mt-5 sm:mt-6 space-y-2 sm:space-y-2.5">
                      {cap.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground/90">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                          <span className="leading-snug">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/[0.04]">
                    <div className="flex flex-wrap gap-1.5">
                      {cap.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            );
          })}
        </Stagger>

        <FadeUp delay={0.2} className="mt-10 sm:mt-14">
          <div className="glass-card flex flex-col items-start gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h3 className="font-display text-base sm:text-lg font-semibold text-foreground">
                Have an architecture or product challenge?
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Let's discuss technical requirements and system design.
              </p>
            </div>
            <Link
              href="#contact"
              className="group inline-flex min-h-[46px] w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-primary/40 hover:bg-white/[0.08] active:scale-[0.98]"
            >
              Start Conversation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
