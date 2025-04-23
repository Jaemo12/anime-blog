import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['cdn.myanimelist.net','firebasestorage.googleapis.com','api.jikan.moe','images.unsplash.com'],
  },
};

export default nextConfig;
