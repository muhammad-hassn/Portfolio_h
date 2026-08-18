import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowRight, ExternalLink, Github } from 'lucide-react';
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
    title: project.title,
    description: project.short_description,
    openGraph: {
      title: `${project.title} | Muhammad Hassan`,
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
      <main className="pt-28">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-grid bg-grid-fade opacity-30" />
            <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/8 blur-[120px]" />
          </div>
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <FadeUp>
              <Link
                href="/#work"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                ← Back to Work
              </Link>
              <span className="mt-6 inline-block rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                {project.category}
              </span>
              <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                {project.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
                {project.short_description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow-sm"
                  >
                    <ExternalLink className="h-4 w-4" /> Live Demo
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card/50 px-5 py-2.5 text-sm font-semibold transition-all hover:border-primary/40"
                  >
                    <Github className="h-4 w-4" /> GitHub
                  </a>
                )}
              </div>
            </FadeUp>
          </div>
        </section>

        {/* Media */}
        {project.media_url && (
          <FadeIn delay={0.1} className="mx-auto max-w-5xl px-4 md:px-6 mt-12">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-card">
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

        {/* Case study content */}
        <section className="mx-auto max-w-3xl px-4 md:px-6 py-16 md:py-24">
          <div className="space-y-12">
            {project.business_problem && (
              <FadeUp>
                <CaseStudyBlock label="Problem" content={project.business_problem} />
              </FadeUp>
            )}
            {project.solution && (
              <FadeUp delay={0.05}>
                <CaseStudyBlock label="Solution" content={project.solution} />
              </FadeUp>
            )}
            {project.how_it_works && (
              <FadeUp delay={0.1}>
                <CaseStudyBlock label="How It Works" content={project.how_it_works} />
              </FadeUp>
            )}
            {project.outcome && (
              <FadeUp delay={0.15}>
                <CaseStudyBlock label="Outcome" content={project.outcome} />
              </FadeUp>
            )}

            {project.technologies.length > 0 && (
              <FadeUp delay={0.2}>
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">Built With</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-border bg-card/40 px-3 py-1.5 font-mono text-xs text-muted-foreground"
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

        {/* CTA */}
        <section className="border-t border-border/40 bg-background-soft/30 py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
            <FadeUp>
              <h2 className="font-display text-2xl font-bold tracking-tight text-balance sm:text-3xl">
                Need something similar for your business?
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-base text-muted-foreground text-pretty">
                I can build a tailored system that fits your workflow and solves your specific problem.
              </p>
              <Link
                href="/#contact"
                className="group mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow"
              >
                Start a Project
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </FadeUp>
          </div>
        </section>

        {/* Similar work */}
        {similar.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-24">
            <FadeUp>
              <h2 className="font-display text-xl font-semibold tracking-tight">Other Work</h2>
            </FadeUp>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {similar.map((p) => (
                <Link
                  key={p.id}
                  href={`/work/${p.slug}`}
                  className="group flex items-center justify-between rounded-xl border border-border bg-card/30 p-5 transition-colors hover:border-primary/30"
                >
                  <div>
                    <span className="text-xs text-muted-foreground">{p.category}</span>
                    <h3 className="mt-1 font-display text-base font-semibold">{p.title}</h3>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
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

function CaseStudyBlock({ label, content }: { label: string; content: string }) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">{label}</h2>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground text-pretty whitespace-pre-line">
        {content}
      </p>
    </div>
  );
}
