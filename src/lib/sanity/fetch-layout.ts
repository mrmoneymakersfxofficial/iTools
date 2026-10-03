import { sanityFetch } from "@/sanity/lib/sanityFetch";
import { layoutQuery } from "@/sanity/queries/layout";
import { categories } from "@/lib/data";

export async function fetchLayoutData() {
  const fallbackCategories = categories.map((c, i) => ({
    _id: c.id,
    name: c.name,
    slug: c.slug,
    iconName: c.icon || "Wrench",
    order: i + 1,
  }));

  try {
    const data: any = await sanityFetch({ query: layoutQuery });
    if (!data) return { categories: fallbackCategories };
    return {
      ...data,
      categories: data.categories?.length ? data.categories : fallbackCategories,
    };
  } catch (error) {
    console.error("Error fetching layout data, serving fallback:", error);
    return { categories: fallbackCategories };
  }
}
