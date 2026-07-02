import type { MetadataRoute } from "next";

const BASE_URL = "https://itools.pe";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/cuenta/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}