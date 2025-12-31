import type { NextConfig } from "next";
import { InkCanvasWebpackPlugin } from "ink-canvas/plugin";
import nextra from "nextra";
import { sync } from "./scripts/sync";
import path from "path";

// Sync documentation on startup
sync();

const withNextra = nextra({});

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "export",
  transpilePackages: ["ink-canvas"],
  images: {
    unoptimized: true,
  },
  outputFileTracingRoot: __dirname,
  experimental: {},
  webpack: (config, options) => {
    if (!options.isServer) {
      config.plugins.push(new InkCanvasWebpackPlugin());
    }
    return config;
  },
};

export default withNextra(nextConfig);
