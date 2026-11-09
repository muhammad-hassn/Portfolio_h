'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'About', href: '/#about' },
  { label: 'Work', href: '/#work' },
  { label: 'Capabilities', href: '/#capabilities' },
  { label: 'Stack', href: '/#tech' },
  { label: 'Process', href: '/#process' },
  { label: 'Contact', href: '/#contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll and touch-action when mobile drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [open]);

  // Close drawer on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <>
      <motion.header
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed left-0 right-0 top-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-[#0A0A0B]/90 backdrop-blur-md border-b border-white/[0.08]'
            : 'bg-transparent border-b border-transparent'
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:py-4 md:px-6">
          <Link href="/" className="group flex items-center gap-2.5 sm:gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 font-display text-sm font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.35)] transition-transform group-hover:scale-105">
              MH
            </span>
            <div className="flex flex-col">
              <span className="font-display text-sm font-semibold tracking-tight text-foreground">
                Muhammad Hassan
              </span>
              <span className="text-[10px] font-mono text-muted-foreground/80 uppercase tracking-wider">
                Full-Stack &amp; AI
              </span>
            </div>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-1.5 backdrop-blur-md md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/#contact"
              className="group inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.35)] active:scale-[0.98]"
            >
              Book a Call
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>

          {/* Mobile menu button (44px min tap target) */}
          <button
            onClick={() => setOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-foreground transition-all active:scale-95 md:hidden"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu className="h-5 w-5" />
          </button>
        </nav>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Slide-in Sheet */}
            <motion.div
              initial={reduce ? { opacity: 0 } : { x: '100%' }}
              animate={reduce ? { opacity: 1 } : { x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: '100%' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 flex h-full w-[82%] max-w-[320px] flex-col border-l border-white/[0.08] bg-[#0c0c0f] p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
                    MH
                  </span>
                  <span className="font-display text-sm font-semibold text-foreground">Menu</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-muted-foreground transition-all hover:text-foreground active:scale-95"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-1.5 overflow-y-auto">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-[48px] items-center rounded-xl px-4 py-3 text-base font-medium text-muted-foreground transition-all hover:bg-white/[0.04] hover:text-foreground active:scale-[0.98] active:bg-white/[0.06]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-white/[0.06]">
                <Link
                  href="/#contact"
                  onClick={() => setOpen(false)}
                  className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-glow-sm transition-all active:scale-[0.98]"
                >
                  <span>Book a Call</span>
                  <span>→</span>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
