'use client';

import { useState } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
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
import { PROJECT_TYPES } from '@/lib/types';
import { FadeUp } from '@/components/motion/motion';

export function Contact() {
  const reduce = useReducedMotion();
  const [form, setForm] = useState({ name: '', email: '', project_type: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Please enter your name.';
    if (!form.email.trim()) e.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email.';
    if (!form.project_type) e.project_type = 'Please select a project type.';
    if (!form.message.trim()) e.message = 'Please tell me about your project.';
    else if (form.message.length < 10) e.message = 'Please provide a bit more detail (at least 10 characters).';
    else if (form.message.length > 2000) e.message = 'Message is too long (max 2000 characters).';
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
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err: any) {
      setStatus('error');
      setErrorMsg('Something went wrong sending your message. Please try again or email me directly.');
    }
  };

  return (
    <section id="contact" className="relative scroll-mt-20 border-t border-border/40 bg-background-soft/30 py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <FadeUp className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Contact
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Have a Project in Mind?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground text-pretty">
            Tell me what you're trying to build, automate or improve. I'll review the idea and get back to you.
          </p>
        </FadeUp>

        <FadeUp delay={0.15} className="mt-10">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-card/40 p-6 sm:p-8"
          >
            <div className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  aria-invalid={!!errors.name}
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@company.com"
                  aria-invalid={!!errors.email}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="project_type" className="text-sm font-medium">Project Type</Label>
                <Select
                  value={form.project_type}
                  onValueChange={(v) => setForm({ ...form, project_type: v })}
                >
                  <SelectTrigger id="project_type" className={errors.project_type ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select a project type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.project_type && <p className="text-xs text-destructive">{errors.project_type}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message" className="text-sm font-medium">Message</Label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell me about your project, what you're trying to build or automate..."
                  rows={5}
                  maxLength={2000}
                  aria-invalid={!!errors.message}
                  className={errors.message ? 'border-destructive' : ''}
                />
                <div className="flex items-center justify-between">
                  {errors.message ? (
                    <p className="text-xs text-destructive">{errors.message}</p>
                  ) : <span />}
                  <span className="text-xs text-muted-foreground/60">{form.message.length}/2000</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : status === 'success' ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Message Sent
                  </>
                ) : (
                  <>
                    Start a Conversation
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

              <AnimatePresence>
                {status === 'success' && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-sm text-success"
                  >
                    Thanks for reaching out! I'll get back to you soon.
                  </motion.p>
                )}
                {status === 'error' && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-sm text-destructive"
                  >
                    {errorMsg}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </form>
        </FadeUp>
      </div>
    </section>
  );
}
