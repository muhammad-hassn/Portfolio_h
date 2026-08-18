'use client';

import { useReducedMotion } from 'framer-motion';

const CAPABILITIES = [
  'AI',
  'Automation',
  'Web Development',
  'APIs',
  'Backend',
  'Mobile Apps',
  'Custom Software',
];

export function CapabilityStrip() {
  const reduce = useReducedMotion();
  const items = [...CAPABILITIES, ...CAPABILITIES];

  return (
    <section className="border-y border-border/40 bg-background-soft/50 py-5">
      <div className="group relative overflow-hidden">
        <div
          className={`flex w-max gap-10 ${reduce ? '' : 'animate-marquee group-hover:[animation-play-state:paused]'}`}
        >
          {items.map((cap, i) => (
            <div key={i} className="flex items-center gap-10">
              <span className="font-display text-lg font-semibold tracking-tight text-muted-foreground/70 transition-colors hover:text-foreground">
                {cap}
              </span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-primary/40" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
