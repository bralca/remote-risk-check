import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "dist",
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["lucide-react"]
  }
};

export default nextConfig;
