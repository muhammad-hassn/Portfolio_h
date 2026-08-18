'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Brain, Workflow, Globe, Server, Database, Smartphone, Boxes } from 'lucide-react';

const NODES = [
  { icon: Brain, label: 'AI', x: 50, y: 0, delay: 0 },
  { icon: Workflow, label: 'Automation', x: 50, y: 25, delay: 0.15 },
  { icon: Server, label: 'API', x: 18, y: 55, delay: 0.3 },
  { icon: Database, label: 'Database', x: 50, y: 55, delay: 0.4 },
  { icon: Boxes, label: 'Workflow', x: 82, y: 55, delay: 0.5 },
  { icon: Globe, label: 'Web App', x: 32, y: 88, delay: 0.65 },
  { icon: Smartphone, label: 'Mobile', x: 68, y: 88, delay: 0.75 },
];

export function HeroVisualization({ reduce }: { reduce: boolean | null }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md lg:max-w-none">
      {/* Glow */}
      <div className="absolute inset-0 rounded-3xl bg-primary/5 blur-2xl" />

      {/* Connection lines (SVG) */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="line-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--accent-2))" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {/* AI -> Automation */}
        <motion.line
          x1="50" y1="8" x2="50" y2="20"
          stroke="url(#line-grad)" strokeWidth="0.4"
          initial={reduce ? { opacity: 0 } : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        />
        {/* Automation -> 3 branches */}
        <motion.line x1="50" y1="30" x2="20" y2="50" stroke="url(#line-grad)" strokeWidth="0.4"
          initial={reduce ? { opacity: 0 } : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} />
        <motion.line x1="50" y1="30" x2="50" y2="50" stroke="url(#line-grad)" strokeWidth="0.4"
          initial={reduce ? { opacity: 0 } : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }} />
        <motion.line x1="50" y1="30" x2="80" y2="50" stroke="url(#line-grad)" strokeWidth="0.4"
          initial={reduce ? { opacity: 0 } : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.6 }} />
        {/* API -> Web App */}
        <motion.line x1="22" y1="60" x2="34" y2="83" stroke="url(#line-grad)" strokeWidth="0.4"
          initial={reduce ? { opacity: 0 } : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.75 }} />
        {/* Workflow -> Mobile */}
        <motion.line x1="78" y1="60" x2="66" y2="83" stroke="url(#line-grad)" strokeWidth="0.4"
          initial={reduce ? { opacity: 0 } : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.85 }} />
        {/* Database -> Web App & Mobile */}
        <motion.line x1="50" y1="60" x2="36" y2="83" stroke="url(#line-grad)" strokeWidth="0.3" strokeDasharray="1 1"
          initial={reduce ? { opacity: 0 } : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.5 }} transition={{ duration: 0.5, delay: 0.9 }} />
        <motion.line x1="50" y1="60" x2="64" y2="83" stroke="url(#line-grad)" strokeWidth="0.3" strokeDasharray="1 1"
          initial={reduce ? { opacity: 0 } : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.5 }} transition={{ duration: 0.5, delay: 1 }} />
      </svg>

      {/* Nodes */}
      {NODES.map((node, i) => {
        const Icon = node.icon;
        return (
          <motion.div
            key={node.label}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 + node.delay, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className={`
                flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card/80 backdrop-blur-sm
                ${i === 0 ? 'shadow-glow-sm border-primary/40' : ''}
                ${i === 1 ? 'border-accent-2/30' : ''}
              `}
              animate={reduce ? {} : { y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
            >
              <Icon className={`h-5 w-5 ${i === 0 ? 'text-primary' : 'text-muted-foreground'}`} />
            </motion.div>
            <span className="text-[10px] font-medium tracking-wide text-muted-foreground">
              {node.label}
            </span>
          </motion.div>
        );
      })}

      {/* Floating status indicators */}
      <motion.div
        className="absolute right-[8%] top-[20%] flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-2.5 py-1 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="flex h-1.5 w-1.5 rounded-full bg-success animate-pulse-glow" />
        <span className="text-[9px] font-mono text-muted-foreground">SYSTEM ONLINE</span>
      </motion.div>
    </div>
  );
}
