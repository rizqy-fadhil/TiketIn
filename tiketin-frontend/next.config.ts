import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        // Duffel airline logo assets (logo_symbol_url / logo_lockup_url)
        protocol: 'https',
        hostname: 'assets.duffel.com',
      },
    ],
  },
};

export default nextConfig;
