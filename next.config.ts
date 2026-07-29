import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const outputDirectory =
  process.env.NEXT_OUTPUT_DIR ??
  (process.env.NODE_ENV === "development" ? ".next" : "dist");

const nextConfig: NextConfig = {
  output: "export",
  distDir: outputDirectory,
  basePath: isGitHubPages ? "/remote-risk-check" : undefined,
  assetPrefix: isGitHubPages ? "/remote-risk-check" : undefined,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["lucide-react"]
  }
};

export default nextConfig;
