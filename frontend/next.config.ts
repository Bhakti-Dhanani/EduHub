import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  publicRuntimeConfig: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:1337/api',
  },
};

export default nextConfig;
