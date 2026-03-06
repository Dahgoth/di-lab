import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        // Apply CSP to all routes
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-inline/eval needed for Next.js dev mode
              "style-src 'self' 'unsafe-inline'", // unsafe-inline needed for Tailwind CSS
              "img-src 'self' data: blob:", // data: for inline images, blob: for dynamic content
              "font-src 'self'",
              "connect-src 'self'", // API calls to same origin
              "object-src 'none'", // Disallow plugins like Flash
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self' https://*.kiloapps.io https://*.vercel.app https://vercel.app https://*.builder.kiloapps.io", // Allow self and preview services
            ].join("; "),
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "ALLOWALL", // Allow framing from any source (CSP controls this)
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
