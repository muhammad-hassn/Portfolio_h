import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import { FloatingWhatsApp } from '@/components/layout/floating-whatsapp';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const display = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const SITE_URL = 'https://portfolioh-rho.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Hassan — Full-Stack & AI Engineer',
    template: '%s | Hassan',
  },
  description:
    'I build scalable web and AI-powered products. Full-stack engineering with Next.js, React, Django, FastAPI, and modern AI tooling.',
  keywords: [
    'full-stack engineer',
    'AI engineer',
    'software engineer',
    'Next.js developer',
    'React developer',
    'Django developer',
    'FastAPI',
    'AI automation',
    'web development',
    'product engineering',
  ],
  authors: [{ name: 'Muhammad Hassan' }],
  creator: 'Muhammad Hassan',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Hassan — Engineer',
    title: 'Hassan — Full-Stack & AI Engineer',
    description:
      'I build scalable web and AI-powered products.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hassan — Full-Stack & AI Engineer',
    description:
      'I build scalable web and AI-powered products.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Muhammad Hassan',
  jobTitle: 'Full-Stack & AI Engineer',
  url: SITE_URL,
  sameAs: [
    'https://github.com/muhammad-hassn',
    'https://www.linkedin.com/in/muhammad-hassan-31a43a319/',
  ],
  knowsAbout: [
    'Full-Stack Development',
    'AI Engineering',
    'Web Applications',
    'Automation',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable} ${mono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground">
        {children}
        <FloatingWhatsApp />
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              color: 'hsl(var(--foreground))',
            },
          }}
        />
      </body>
    </html>
  );
}
