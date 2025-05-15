import type { NextConfig } from "next";

const securityHeaders = [
  // Content Security Policy - ochrona przed XSS
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:;"
  },
  // X-Frame-Options - zapobiega clickjackingowi
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  // X-Content-Type-Options - zapobiega sniffingowi MIME
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  // Referrer-Policy - kontrola informacji o źródle
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  // Permissions-Policy - ograniczenie dostępu do wrażliwych API
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  },
  // Strict-Transport-Security - wymuszanie HTTPS
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  }
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Ukrywa nagłówek X-Powered-By
  
  // Konfiguracja nagłówków bezpieczeństwa
  async headers() {
    return [
      {
        source: '/:path*', // Dotyczy wszystkich ścieżek
        headers: securityHeaders,
      },
    ];
  },
  
  // Opcjonalnie - konfiguracja przekierowań (np. wymuszanie HTTPS)
  async redirects() {
    return [];
  },
};

export default nextConfig;