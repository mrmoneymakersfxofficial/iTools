import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  turbopack: {},
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
    "@sanity/visual-editing",
    "styled-components",
  ],
  async redirects() {
    return [
      {
        source: "/studio/:path*",
        destination: "/cms/:path*",
        permanent: true,
      },
      {
        source: "/studio",
        destination: "/cms",
        permanent: true,
      }
    ];
  },
};

export default withSerwist(nextConfig);

