import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@repo/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/**',
      },
    ],
  },
  allowedDevOrigins: ['172.25.248.81', '127.0.0.1', 'localhost', '174.138.79.19'],

};
export default nextConfig;
