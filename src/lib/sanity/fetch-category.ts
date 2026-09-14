import { sanityFetch } from "@/sanity/lib/sanityFetch";

export const categoryBySlugQuery = `*[_type == "category" && slug.current == $slug][0] {
  _id,
  "id": _id,
  name,
  "slug": slug.current,
  iconName,
  color,
  description,
  productsLimit,
  bannerTitle,
  bannerSubtitle,
  bannerLink,
  bannerImage { asset-> { url, metadata { dimensions { width, height }, lqip } } }
}`;

export const productsByCategorySlugQuery = `*[_type == "product" && (category->slug.current == $slug || name match $keyword || ($slug in ["combos", "combo"] && (name match "*combo*" || name match "*kit*" || name match "*set*" || name match "*duo*" || name match "*pack*"))) && isActive == true][0...$limit] | order(stock desc, _createdAt desc) {
  _id,
  "id": _id,
  name,
  "slug": slug.current,
  sku,
  brand->{ name, "slug": coalesce(slug.current, slug) },
  price,
  salePrice,
  comparePrice,
  discountBadge,
  stock,
  rating,
  reviews,
  "reviewCount": reviews,
  image,
  images
}`;

const fallbackCategoriesMap: Record<string, any> = {
  combos: {
    _id: "category-combos",
    id: "category-combos",
    name: "Combos & Promociones",
    slug: "combos",
    iconName: "Package",
    color: "#E60000",
    bannerTitle: "COMBOS Y KITS EN OFERTA",
    bannerSubtitle: "Los mejores combos y kits de herramientas profesionales con precios exclusivos",
    productsLimit: 48,
  },
  "equipos-especializados": {
    _id: "category-equipos-especializados",
    id: "category-equipos-especializados",
    name: "Equipos Especializados",
    slug: "equipos-especializados",
    iconName: "Zap",
    color: "#E60000",
    bannerTitle: "EQUIPOS ESPECIALIZADOS",
    bannerSubtitle: "Equipos y maquinaria especializada para construcción e industria",
    productsLimit: 48,
  },
  repuestos: {
    _id: "category-repuestos",
    id: "category-repuestos",
    name: "Repuestos",
    slug: "repuestos",
    iconName: "Wrench",
    color: "#E60000",
    bannerTitle: "REPUESTOS ORIGINALES",
    bannerSubtitle: "Repuestos genuinos, carbones, baterías y consumibles",
    productsLimit: 48,
  },
  "ferreteria-general": {
    _id: "category-ferreteria-general",
    id: "category-ferreteria-general",
    name: "Ferretería General",
    slug: "ferreteria-general",
    iconName: "Hammer",
    color: "#E60000",
    bannerTitle: "FERRETERÍA GENERAL",
    bannerSubtitle: "Fijaciones, tornillería, selladores y suministros ferreteros",
    productsLimit: 48,
  },
};

export async function fetchCategoryBySlug(slug: string) {
  try {
    const res: any = await sanityFetch({ query: categoryBySlugQuery, params: { slug } });
    if (res && res.name) return res;
    if (fallbackCategoriesMap[slug]) return fallbackCategoriesMap[slug];
    return null;
  } catch (error) {
    return fallbackCategoriesMap[slug] || null;
  }
}

export async function fetchProductsByCategorySlug(slug: string, limit: number = 24) {
  try {
    const rootWord = slug.split("-")[0].replace(/s$/, "");
    const keyword = `*${rootWord}*`;
    const numLimit = Number(limit) > 0 ? Number(limit) : 48;
    return await sanityFetch({ query: productsByCategorySlugQuery, params: { slug, keyword, limit: numLimit } });
  } catch (error) {
    return [];
  }
}

export async function fetchAllCategorySlugs() {
  try {
    return await sanityFetch({ query: `*[_type == "category"] { "slug": slug.current }` });
  } catch (error) {
    return [];
  }
}
