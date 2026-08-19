import os from "os";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function lanDevOrigins() {
  const hosts = new Set();
  for (const addrs of Object.values(os.networkInterfaces())) {
    for (const addr of addrs || []) {
      const ipv4 = addr.family === "IPv4" || addr.family === 4;
      if (!ipv4 || addr.internal) continue;
      hosts.add(addr.address);
    }
  }
  return [...hosts];
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin Turbopack to this app. Parent folders (Desktop with many projects /
  // lockfiles / iCloud) must never become the inferred workspace root.
  turbopack: {
    root: __dirname,
  },
  // Same idea for file tracing / monorepo inference.
  outputFileTracingRoot: __dirname,
  // Next.js 16 blocks /_next JS unless the LAN hostname is listed ( "*" is ignored ).
  // Without this, the page HTML loads over Wi-Fi but React never hydrates — no
  // client validation messages.
  allowedDevOrigins: lanDevOrigins(),
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
