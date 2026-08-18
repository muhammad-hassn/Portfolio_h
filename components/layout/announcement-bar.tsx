'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AnnouncementBar({ text }: { text: string }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('announcement-dismissed');
    if (dismissed) setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-50 overflow-hidden border-b border-border/60 bg-background-soft"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2">
          <span className="flex h-1.5 w-1.5 rounded-full bg-success animate-pulse-glow" />
          <p className="text-xs font-medium tracking-wide text-muted-foreground">
            {text}
          </p>
          <button
            onClick={() => {
              sessionStorage.setItem('announcement-dismissed', '1');
              setVisible(false);
            }}
            aria-label="Dismiss announcement"
            className="ml-2 text-muted-foreground/60 transition-colors hover:text-foreground"
          >
            ×
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
