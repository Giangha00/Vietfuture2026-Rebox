import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin Turbopack to this app. Parent folders (Desktop with many projects /
  // lockfiles / iCloud) must never become the inferred workspace root.
  turbopack: {
    root: __dirname,
  },
  // Same idea for file tracing / monorepo inference.
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5001",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5001",
        pathname: "/seed/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5001",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5001",
        pathname: "/seed/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
    // Avoid dev SSR hanging while optimizing remote mock images
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
