export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice: number | null;
  categoryId: string | null;
  brandId: string | null;
  brand?: Brand;
  category?: Category;
  stock: number;
  images: string[];
  specs: Record<string, string>;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isOnSale: boolean;
  isNewArrival: boolean;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  image: string | null;
  icon: string | null;
  order: number;
  children?: Category[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  ctaLink: string;
  image: string;
  badge?: string;
  badgeColor?: string;
}