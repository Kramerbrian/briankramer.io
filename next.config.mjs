import createMDX from '@next/mdx';

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self'",
  "connect-src 'self' https://vitals.vercel-insights.com https://*.vercel-insights.com",
  "frame-src https://open.spotify.com",
  "media-src 'self' https://open.spotify.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
].join('; ');

const contentSecurityPolicyReportOnly = [
  contentSecurityPolicy,
  "report-to default",
].join('; ');

const permissionsPolicy = [
  'accelerometer=()',
  'browsing-topics=()',
  'camera=()',
  'display-capture=()',
  'geolocation=()',
  'gyroscope=()',
  'magnetometer=()',
  'microphone=()',
  'midi=()',
  'payment=()',
  'publickey-credentials-get=()',
  'sync-xhr=()',
  'usb=()',
  'xr-spatial-tracking=()',
  'autoplay=(self "https://open.spotify.com")',
  'clipboard-write=(self "https://open.spotify.com")',
  'encrypted-media=(self "https://open.spotify.com")',
  'fullscreen=(self "https://open.spotify.com")',
  'picture-in-picture=(self "https://open.spotify.com")',
].join(', ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  turbopack: {
    root: process.cwd(),
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: contentSecurityPolicy,
          },
          {
            key: 'Content-Security-Policy-Report-Only',
            value: contentSecurityPolicyReportOnly,
          },
          { key: 'Permissions-Policy', value: permissionsPolicy },
        ],
      },
    ];
  },
};

export default withMDX(nextConfig);
