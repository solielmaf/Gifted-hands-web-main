import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["127.0.0.1", "localhost"], // 👈 allow backend images
  
     unoptimized: true, // Disable optimization if you're still having issues
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

};

export default nextConfig;
