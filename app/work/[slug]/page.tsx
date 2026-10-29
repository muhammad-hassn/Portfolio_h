import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowRight, ExternalLink, Github, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ScrollProgress } from '@/components/motion/scroll-progress';
import { FadeUp, FadeIn } from '@/components/motion/motion';
import { getProjectBySlug, getProjects, getProfile } from '@/lib/data';
import { DEFAULT_PROFILE } from '@/lib/types';

export const revalidate = 60;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: `${project.title} — Case Study | Muhammad Hassan`,
    description: project.short_description,
    openGraph: {
      title: `${project.title} — Software Engineering Case Study`,
      description: project.short_description,
      images: project.media_type === 'image' && project.media_url ? [{ url: project.media_url }] : undefined,
    },
  };
}

export default async function ProjectDetail({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  const profile = (await getProfile()) ?? DEFAULT_PROFILE;

  if (!project) notFound();

  const allProjects = await getProjects();
  const similar = allProjects.filter((p) => p.id !== project.id).slice(0, 2);

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="pt-28 pb-20">
        {/* Header Hero */}
        <section className="relative overflow-hidden py-12 md:py-16">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-[120px]" />
          </div>
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <FadeUp>
              <Link
                href="/#work"
                className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                Back to Selected Work
              </Link>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-white/[0.1] bg-white/[0.03] px-3 py-1 font-mono text-xs font-medium text-muted-foreground backdrop-blur-sm">
                  {project.category}
                </span>
                {project.featured && (
                  <span className="rounded-full bg-primary/20 border border-primary/30 px-3 py-1 font-mono text-xs font-semibold text-primary">
                    Featured Project
                  </span>
                )}
              </div>

              <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-6xl text-foreground">
                {project.title}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {project.short_description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                  >
                    <ExternalLink className="h-4 w-4" /> Live Deployment
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.03] px-5 py-2.5 text-xs font-semibold text-foreground transition-all hover:border-primary/40 hover:bg-white/[0.06]"
                  >
                    <Github className="h-4 w-4" /> Source Code
                  </a>
                )}
              </div>
            </FadeUp>
          </div>
        </section>

        {/* Media Preview */}
        {project.media_url && (
          <FadeIn delay={0.1} className="mx-auto max-w-5xl px-4 md:px-6">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] shadow-2xl">
              {project.media_type === 'video' ? (
                <video
                  src={project.media_url}
                  className="h-full w-full object-cover"
                  controls
                  muted
                  playsInline
                />
              ) : (
                <Image
                  src={project.media_url}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  priority
                />
              )}
            </div>
          </FadeIn>
        )}

        {/* Structured Case Study Sections */}
        <section className="mx-auto max-w-4xl px-4 md:px-6 py-16 md:py-24">
          <div className="grid gap-8">
            {project.business_problem && (
              <FadeUp>
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 md:p-9 backdrop-blur-sm">
                  <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-primary">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    Problem Definition & Objectives
                  </div>
                  <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-foreground">
                    What needed to be solved
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                    {project.business_problem}
                  </p>
                </div>
              </FadeUp>
            )}

            {project.solution && (
              <FadeUp delay={0.05}>
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 md:p-9 backdrop-blur-sm">
                  <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Engineering Solution
                  </div>
                  <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-foreground">
                    System design & technical approach
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                    {project.solution}
                  </p>
                </div>
              </FadeUp>
            )}

            {project.how_it_works && (
              <FadeUp delay={0.1}>
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 md:p-9 backdrop-blur-sm">
                  <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-indigo-400">
                    <span className="h-2 w-2 rounded-full bg-indigo-400" />
                    Architecture & Implementation
                  </div>
                  <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-foreground">
                    Workflow & Technical Mechanics
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                    {project.how_it_works}
                  </p>
                </div>
              </FadeUp>
            )}

            {project.outcome && (
              <FadeUp delay={0.15}>
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/[0.08] p-7 md:p-9 backdrop-blur-sm">
                  <div className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Outcome & Measurable Impact
                  </div>
                  <h3 className="mt-3 font-display text-xl font-bold tracking-tight text-foreground">
                    Delivered results
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                    {project.outcome}
                  </p>
                </div>
              </FadeUp>
            )}

            {project.technologies && project.technologies.length > 0 && (
              <FadeUp delay={0.2}>
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 md:p-9 backdrop-blur-sm">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Technologies & Libraries
                  </h4>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeUp>
            )}
          </div>
        </section>

        {/* CTA banner */}
        <section className="mx-auto max-w-4xl px-4 md:px-6">
          <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-primary/10 via-white/[0.02] to-transparent p-8 md:p-12 text-center backdrop-blur-sm">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Need a similar product engineered?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              I can build a resilient, custom system tailored to your technical requirements and growth goals.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                href="/#contact"
                className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-semibold text-primary-foreground shadow-glow transition-all hover:shadow-[0_0_24px_rgba(99,102,241,0.5)]"
              >
                Book a Strategy Call
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* More projects */}
        {similar.length > 0 && (
          <section className="mx-auto max-w-5xl px-4 md:px-6 mt-20">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">
                More Case Studies
              </h2>
              <Link href="/#work" className="text-xs font-semibold text-primary hover:text-primary/80">
                View all work →
              </Link>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {similar.map((p) => (
                <Link
                  key={p.id}
                  href={`/work/${p.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:border-primary/40 hover:bg-white/[0.04]"
                >
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
                      {p.category}
                    </span>
                    <h3 className="mt-1 font-display text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                      {p.title}
                    </h3>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer profile={profile} />
    </>
  );
}
