import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
      </div>
      <div className="text-center">
        <span className="font-display text-7xl font-bold text-gradient-accent sm:text-8xl">404</span>
        <h1 className="mt-4 font-display text-xl font-semibold">This route doesn't exist.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for may have been moved or removed.
        </p>
        <Link
          href="/"
          className="group mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:shadow-glow"
        >
          Back to Home
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
