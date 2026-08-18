import './globals.css';
import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'sonner';

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

const SITE_URL = 'https://muhammadhassan.dev';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Muhammad Hassan | AI Automation & Full-Stack Developer',
    template: '%s | Muhammad Hassan',
  },
  description:
    'I build AI-powered applications, business websites, automation workflows, APIs and custom software for businesses and startups.',
  keywords: [
    'AI automation developer',
    'AI developer',
    'automation developer',
    'Next.js developer',
    'full-stack developer',
    'FastAPI developer',
    'AI integration',
    'n8n automation',
    'custom software development',
  ],
  authors: [{ name: 'Muhammad Hassan' }],
  creator: 'Muhammad Hassan',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Muhammad Hassan',
    title: 'Muhammad Hassan | AI Automation & Full-Stack Developer',
    description:
      'I build AI-powered applications, business websites, automation workflows, APIs and custom software for businesses and startups.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muhammad Hassan | AI Automation & Full-Stack Developer',
    description:
      'I build AI-powered applications, business websites, automation workflows, APIs and custom software for businesses and startups.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground">
        {children}
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
