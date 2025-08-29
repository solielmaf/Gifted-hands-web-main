import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["127.0.0.1", "localhost"], // 👈 allow backend images
  },
};

export default nextConfig;
