'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import type { Profile } from '@/lib/types';
import { FadeUp } from '@/components/motion/motion';

const WHATSAPP_URL =
  'https://wa.me/923408062138?text=Hi%20Hassan%2C%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project.';

const HIGHLIGHT_CHIPS = [
  'Based in Karachi, PK',
  'Remote-friendly',
  'Replies within 24 hours',
];

export function About({ profile }: { profile?: Profile }) {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      id="about"
      className="relative scroll-mt-20 py-14 sm:py-20 md:py-28 lg:py-32 border-t border-white/[0.04]"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/3 top-1/2 h-[350px] sm:h-[450px] w-[500px] -translate-y-1/2 rounded-full bg-primary/[0.03] blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          {/* Left Column: Photo */}
          <FadeUp className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm shadow-2xl">
              {/* Subtle radial glow inside card */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-primary/5 to-transparent blur-xl" />

              {!imgError ? (
                <Image
                  src="/hassan.jpg"
                  alt="Muhammad Hassan — Full-Stack & AI Engineer"
                  fill
                  className="object-cover object-top transition-transform duration-500 hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 420px"
                  priority
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-indigo-950/40 via-background to-background">
                  <span className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 font-display text-4xl font-bold text-white shadow-[0_0_30px_rgba(99,102,241,0.4)]">
                    MH
                  </span>
                  <span className="mt-4 font-display text-sm font-semibold text-foreground">
                    Muhammad Hassan
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    Karachi, Pakistan
                  </span>
                </div>
              )}

              {/* Bottom gradient fade for seamless integration */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0A0A0B]/80 via-transparent to-transparent" />
            </div>
          </FadeUp>

          {/* Right Column: Copy & Actions */}
          <FadeUp delay={0.15} className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              About
            </span>

            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl text-foreground">
              About Me
            </h2>

            <p className="mt-4 sm:mt-5 text-[15px] sm:text-base leading-relaxed text-muted-foreground text-pretty">
              I&apos;m Muhammad Hassan, a full-stack and AI engineer based in Karachi,
              Pakistan. I build web applications with Next.js, React, Django, and
              FastAPI, and I design AI-powered automations (n8n, Telegram and email
              agents) that save businesses time and capture more leads. I like
              turning messy manual workflows into simple, reliable systems, and I
              care about clean code, clear communication, and shipping things that
              actually work. I&apos;m currently studying Software Engineering while
              taking on freelance projects for clients worldwide.
            </p>

            {/* Highlight Chips */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {HIGHLIGHT_CHIPS.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 font-mono text-xs text-white/80 backdrop-blur-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {chip}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-12 min-h-[48px] items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 text-sm font-semibold text-white shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all active:scale-[0.98]"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>Chat on WhatsApp</span>
              </a>

              <Link
                href="#contact"
                className="inline-flex h-12 min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-transparent hover:bg-white/[0.04] px-6 text-sm font-semibold text-foreground backdrop-blur-sm transition-all active:scale-[0.98]"
              >
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Book a Call</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
