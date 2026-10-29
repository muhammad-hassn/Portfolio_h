'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import type { Project } from '@/lib/types';
import { FadeUp, Stagger, StaggerItem } from '@/components/motion/motion';
import { useRef, useState, useCallback } from 'react';

export function SelectedWork({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;

  return (
    <section id="work" className="relative scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <FadeUp className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Selected Work
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tighter text-balance sm:text-4xl lg:text-5xl">
            Products I've Shipped
          </h2>
          <p className="mt-4 text-base text-muted-foreground text-pretty">
            Real-world products spanning AI, automation, web and mobile — each solving a concrete problem.
          </p>
        </FadeUp>

        <Stagger staggerChildren={0.12} className="mt-14 grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <StaggerItem key={project.id}>
              <ProjectCard project={project} />
            </StaggerItem>
          ))}
        </Stagger>

        <FadeUp delay={0.2} className="mt-14">
          <div className="glass-card flex flex-col items-start gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h3 className="font-display text-lg font-semibold">
                Need a similar product built?
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                I design, build, and ship end-to-end.
              </p>
            </div>
            <Link
              href="#contact"
              className="group inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow-sm"
            >
              Book a Call
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduce || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setTilt({
        x: (y - 0.5) * -8,
        y: (x - 0.5) * 8,
      });
    },
    [reduce]
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ perspective: 800 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm transition-colors hover:border-primary/20"
    >
      {/* Hover glow */}
      {isHovered && (
        <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl shadow-[inset_0_0_80px_-20px_hsl(243_75%_59%/0.15)]" />
      )}

      {/* Media */}
      <div className="relative aspect-[16/10] overflow-hidden border-b border-white/[0.06] bg-background">
        {project.media_url ? (
          project.media_type === 'video' ? (
            <video
              src={project.media_url}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              muted
              loop
              playsInline
              poster={undefined}
            />
          ) : (
            <Image
              src={project.media_url}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent-2/5">
            <span className="font-display text-3xl font-bold text-white/10">
              {project.title.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-background/70 px-2.5 py-1 text-xs font-medium text-muted-foreground backdrop-blur-md">
          {project.category}
        </span>
        {project.featured && (
          <span className="absolute right-3 top-3 rounded-full bg-primary/90 px-2.5 py-1 text-xs font-semibold text-primary-foreground backdrop-blur-sm">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-lg font-semibold tracking-tight">
          {project.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {project.short_description}
        </p>

        {project.technologies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center gap-3">
          <Link
            href={`/work/${project.slug}`}
            className="group/link inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            View Case Study
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
          </Link>
          <div className="ml-auto flex items-center gap-2">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Live demo"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub repository"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
              >
                <Github className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
