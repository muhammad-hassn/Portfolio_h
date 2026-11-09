'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ExternalLink, Github } from 'lucide-react';
import type { Project } from '@/lib/types';
import { FadeUp } from '@/components/motion/motion';
import { useRef, useState, useCallback, useEffect } from 'react';

import fallbackProjectsData from '@/lib/fallback-projects.json';

export function SelectedWork({ projects }: { projects?: Project[] }) {
  const displayProjects = projects && projects.length > 0 ? projects : (fallbackProjectsData as Project[]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!displayProjects.length) return null;

  // Track active slide on mobile horizontal scroll
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    if (clientWidth > 0) {
      const index = Math.round(scrollLeft / (clientWidth * 0.85));
      setActiveIndex(Math.min(index, displayProjects.length - 1));
    }
  };

  const scrollToCard = (index: number) => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.clientWidth * 0.85 + 16;
    scrollRef.current.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth',
    });
  };

  return (
    <section id="work" className="relative scroll-mt-20 py-14 sm:py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <FadeUp className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Selected Work
          </span>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Products I've Shipped
          </h2>
          <p className="mt-3 sm:mt-4 text-[15px] sm:text-base leading-relaxed text-muted-foreground text-pretty">
            Real-world products spanning AI, automation, and web — each solving a concrete problem.
          </p>
        </FadeUp>

        {/* Mobile Horizontal Snap Carousel (< md) / Desktop Grid (md+) */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="mt-8 sm:mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto no-scrollbar px-4 pb-4 pt-1 sm:px-6 -mx-4 sm:-mx-6 md:mx-0 md:px-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible"
        >
          {displayProjects.map((project) => (
            <div
              key={project.id}
              className="w-[84vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none md:shrink md:snap-align-none"
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {/* Mobile Carousel Indicators (dots) */}
        {displayProjects.length > 1 && (
          <div className="mt-2 flex items-center justify-center gap-1.5 md:hidden">
            {displayProjects.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToCard(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === i ? 'w-6 bg-primary' : 'w-1.5 bg-white/20'
                }`}
                aria-label={`Go to project ${i + 1}`}
              />
            ))}
          </div>
        )}

        <FadeUp delay={0.2} className="mt-10 sm:mt-14">
          <div className="glass-card flex flex-col items-start gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h3 className="font-display text-base sm:text-lg font-semibold">
                Need a similar product built?
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                I design, build, and ship end-to-end.
              </p>
            </div>
            <Link
              href="#contact"
              className="group inline-flex min-h-[44px] w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow-sm transition-all hover:shadow-glow active:scale-[0.98]"
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
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    // Only enable mouse tilt on devices with genuine pointer/hover support
    setCanHover(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduce || !canHover || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setTilt({
        x: (y - 0.5) * -6,
        y: (x - 0.5) * 6,
      });
    },
    [reduce, canHover]
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => canHover && setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={canHover ? { rotateX: tilt.x, rotateY: tilt.y } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={canHover ? { perspective: 800 } : undefined}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 sm:p-5 backdrop-blur-sm transition-all active:scale-[0.98] hover:border-primary/30"
    >
      {/* Desktop hover glow */}
      {isHovered && canHover && (
        <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl shadow-[inset_0_0_60px_-15px_hsl(243_75%_59%/0.2)]" />
      )}

      {/* Cover Media: compact aspect-video, rounded-xl */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/[0.06] bg-background">
        {project.media_url ? (
          project.media_type === 'video' ? (
            <video
              src={project.media_url}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 85vw, 50vw"
            />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent-2/10">
            <span className="font-display text-2xl sm:text-3xl font-bold text-white/20">
              {project.title.charAt(0)}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent pointer-events-none" />

        <span className="absolute left-2.5 top-2.5 rounded-full border border-white/10 bg-background/80 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground backdrop-blur-md">
          {project.category}
        </span>
        {project.featured && (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-primary/90 px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-primary-foreground backdrop-blur-sm shadow-sm">
            Featured
          </span>
        )}
      </div>

      {/* Content & Metadata */}
      <div className="mt-3 flex flex-1 flex-col">
        <h3 className="font-display text-base sm:text-lg font-semibold tracking-tight text-foreground line-clamp-1">
          {project.title}
        </h3>
        <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {project.short_description}
        </p>

        {/* Tech Chips: max 3 + counter */}
        {project.technologies.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {project.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] sm:text-[11px] text-muted-foreground"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="rounded-md border border-white/[0.06] bg-white/[0.02] px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground/70">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Clear CTA Row */}
        <div className="mt-4 pt-3 flex items-center gap-2 border-t border-white/[0.06]">
          <Link
            href={`/work/${project.slug}`}
            className="flex-1 min-h-[42px] sm:min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs sm:text-sm font-semibold text-primary-foreground shadow-glow-sm transition-all hover:shadow-glow active:scale-[0.98]"
          >
            <span>View Case Study</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Live demo"
              className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground active:scale-[0.98]"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
              className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground active:scale-[0.98]"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
