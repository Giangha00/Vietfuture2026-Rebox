/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    // Avoid dev SSR hanging while optimizing remote mock images
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
