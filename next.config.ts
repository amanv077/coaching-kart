import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Allow warnings without breaking the build
  },
  // Add other config options here as needed
};

export default nextConfig;
