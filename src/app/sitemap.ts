import type { MetadataRoute } from "next";
import { products, categories } from "@/lib/data";

const BASE_URL = "https://itools.pe";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/producto/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = [];
  for (const cat of categories) {
    categoryPages.push({
      url: `${BASE_URL}/categoria/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    });
    cat.children?.forEach((child) => {
      categoryPages.push({
        url: `${BASE_URL}/categoria/${child.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      });
    });
  }

  return [...staticPages, ...categoryPages, ...productPages];
}