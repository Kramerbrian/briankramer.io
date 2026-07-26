import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { siteConfig } from '@/lib/utils';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: '%s — Brian Kramer',
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
  creator: siteConfig.author.name,
  openGraph: {
    type: 'website',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: siteConfig.title }],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#F7F5F1',
  width: 'device-width',
  initialScale: 1,
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteConfig.author.name,
  url: siteConfig.url,
  jobTitle: 'EVP, Dealer Growth & Success',
  worksFor: {
    '@type': 'Organization',
    name: 'Cars Commerce',
    url: 'https://www.cars.com',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Naples',
    addressRegion: 'FL',
    addressCountry: 'US',
  },
  email: `mailto:${siteConfig.author.email}`,
  sameAs: [
    siteConfig.socials.linkedin,
    siteConfig.socials.youtube,
    siteConfig.socials.instagram,
    siteConfig.socials.tiktok,
    siteConfig.socials.facebook,
    siteConfig.socials.linktree,
  ],
  knowsAbout: [
    'Automotive retail',
    'Used vehicle acquisition',
    'Dealership operations',
    'Digital transformation',
    'Vehicle appraisal',
    'AI search visibility',
  ],
};

const enableVercelInsights = process.env.VERCEL === '1';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        {enableVercelInsights && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
        <Script
          id="schema-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
