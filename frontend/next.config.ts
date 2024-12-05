import { CONFIG } from '@/config';
import type { NextConfig } from 'next';

const url = new URL(CONFIG.PUBLIC_S3_URL);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: url.protocol.slice(0, -1) as 'http' | 'https',
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname.endsWith('/')
          ? url.pathname + '**'
          : url.pathname + '/**',
        search: url.search,
      },
    ],
  },
};

export default nextConfig;
