'use client';

import { useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, Loader2, Mail, Github, Linkedin, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase/client';
import { PROJECT_TYPES, type Profile } from '@/lib/types';
import { FadeUp } from '@/components/motion/motion';

export function Contact({ profile }: { profile?: Profile }) {
  const reduce = useReducedMotion();
  const [form, setForm] = useState({ name: '', email: '', project_type: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const email = profile?.email || 'm.hassn.2005@gmail.com';
  const github = profile?.github_url || 'https://github.com/muhammad-hassn';
  const linkedin = profile?.linkedin_url || 'https://www.linkedin.com/in/muhammad-hassan-45129031b/';

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Please enter your name.';
    if (!form.email.trim()) e.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid work email.';
    if (!form.project_type) e.project_type = 'Please select a project type.';
    if (!form.message.trim()) e.message = 'Please provide details about the project or challenge.';
    else if (form.message.length < 10) e.message = 'Please provide a bit more context (minimum 10 characters).';
    else if (form.message.length > 2000) e.message = 'Message exceeds 2000 characters.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    setErrorMsg('');

    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: form.name.trim(),
        email: form.email.trim(),
        project_type: form.project_type,
        message: form.message.trim(),
      });

      if (error) throw error;

      setStatus('success');
      setForm({ name: '', email: '', project_type: '', message: '' });
      setTimeout(() => setStatus('idle'), 6000);
    } catch (err: any) {
      setStatus('error');
      setErrorMsg('Could not submit the form right now. Please email directly at ' + email);
    }
  };

  return (
    <section id="contact" className="relative scroll-mt-20 py-14 sm:py-20 md:py-28 lg:py-32 border-t border-white/[0.04]">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[400px] sm:h-[500px] w-[500px] sm:w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.04] blur-[100px] sm:blur-[140px]" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <FadeUp className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Initiate Contact
          </span>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Let's Build Something High-Impact
          </h2>
          <p className="mt-3 sm:mt-4 text-[15px] sm:text-base leading-relaxed text-muted-foreground text-pretty">
            Whether you need a full-stack product, an autonomous AI pipeline, or high-scale system architecture, let's connect.
          </p>
        </FadeUp>

        <div className="mt-8 sm:mt-14 grid gap-6 sm:gap-8 lg:grid-cols-5">
          {/* Direct channels column */}
          <FadeUp delay={0.1} className="lg:col-span-2 flex flex-col justify-between space-y-4 sm:space-y-6">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6 backdrop-blur-sm space-y-5">
              <div>
                <h3 className="font-display text-base font-semibold text-foreground">
                  Direct Inquiries
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  Typical response within 24 business hours.
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 text-sm text-foreground transition-all hover:border-primary/40 hover:bg-white/[0.05] active:scale-[0.98] min-w-0"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="truncate min-w-0">
                    <span className="block text-[10px] font-mono text-muted-foreground/80">EMAIL</span>
                    <span className="truncate block font-medium text-xs sm:text-sm">{email}</span>
                  </div>
                </a>

                {linkedin && (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 text-sm text-foreground transition-all hover:border-primary/40 hover:bg-white/[0.05] active:scale-[0.98] min-w-0"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Linkedin className="h-4 w-4" />
                    </div>
                    <div className="truncate min-w-0">
                      <span className="block text-[10px] font-mono text-muted-foreground/80">LINKEDIN</span>
                      <span className="truncate block font-medium text-xs sm:text-sm">Connect on LinkedIn</span>
                    </div>
                  </a>
                )}

                {github && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 text-sm text-foreground transition-all hover:border-primary/40 hover:bg-white/[0.05] active:scale-[0.98] min-w-0"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Github className="h-4 w-4" />
                    </div>
                    <div className="truncate min-w-0">
                      <span className="block text-[10px] font-mono text-muted-foreground/80">GITHUB</span>
                      <span className="truncate block font-medium text-xs sm:text-sm">Browse Code Repositories</span>
                    </div>
                  </a>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-primary/10 via-white/[0.02] to-transparent p-5 sm:p-6 backdrop-blur-sm">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Engineering Availability
              </span>
              <p className="mt-2 text-xs sm:text-sm text-foreground font-medium">
                Taking on select contracts &amp; architecture roles
              </p>
              <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground">
                Available for high-stakes web apps, AI integrations, and technical advisory.
              </p>
            </div>
          </FadeUp>

          {/* Form column */}
          <FadeUp delay={0.15} className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-8 backdrop-blur-sm"
            >
              <div className="grid gap-4 sm:gap-5">
                <div className="grid gap-1.5 sm:gap-2">
                  <Label htmlFor="name" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name or company"
                    aria-invalid={!!errors.name}
                    className="min-h-[46px] h-12 text-base sm:text-sm border-white/[0.08] bg-white/[0.02] focus:border-primary/50 text-foreground"
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>

                <div className="grid gap-1.5 sm:gap-2">
                  <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Work Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@company.com"
                    aria-invalid={!!errors.email}
                    className="min-h-[46px] h-12 text-base sm:text-sm border-white/[0.08] bg-white/[0.02] focus:border-primary/50 text-foreground"
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>

                <div className="grid gap-1.5 sm:gap-2">
                  <Label htmlFor="project_type" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Project Scope
                  </Label>
                  <Select
                    value={form.project_type}
                    onValueChange={(v) => setForm({ ...form, project_type: v })}
                  >
                    <SelectTrigger
                      id="project_type"
                      className="min-h-[46px] h-12 text-base sm:text-sm border-white/[0.08] bg-white/[0.02] text-foreground focus:border-primary/50"
                    >
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent className="border-white/[0.1] bg-[#121215]">
                      {PROJECT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.project_type && (
                    <p className="text-xs text-destructive">{errors.project_type}</p>
                  )}
                </div>

                <div className="grid gap-1.5 sm:gap-2">
                  <Label htmlFor="message" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Project Details &amp; Goals
                  </Label>
                  <Textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Briefly describe what you're building, the timeline, and technical objectives..."
                    rows={4}
                    maxLength={2000}
                    aria-invalid={!!errors.message}
                    className="text-base sm:text-sm border-white/[0.08] bg-white/[0.02] focus:border-primary/50 text-foreground"
                  />
                  <div className="flex items-center justify-between">
                    {errors.message ? (
                      <p className="text-xs text-destructive">{errors.message}</p>
                    ) : (
                      <span />
                    )}
                    <span className="text-[10px] text-muted-foreground/60">{form.message.length}/2000</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className="group inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm sm:text-base font-semibold text-primary-foreground shadow-glow-sm transition-all hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                    </>
                  ) : status === 'success' ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" /> Message Sent Successfully
                    </>
                  ) : (
                    <>
                      Send Inquiry
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {status === 'success' && (
                    <motion.div
                      initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-xs sm:text-sm text-emerald-400"
                    >
                      Thank you! Your message has been received. I'll get back to you shortly.
                    </motion.div>
                  )}
                  {status === 'error' && (
                    <motion.div
                      initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs sm:text-sm text-destructive"
                    >
                      {errorMsg}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
