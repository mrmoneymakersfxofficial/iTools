import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    unoptimized: false,
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  transpilePackages: [
    "sanity",
    "next-sanity",
    "@sanity/vision",
    "@sanity/image-url",
    "@sanity/presentation",
  ],
  async redirects() {
    return [
      {
        source: "/CMS",
        destination: "/studio",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;