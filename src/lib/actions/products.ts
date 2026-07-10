'use server'

import { db } from '@/lib/db'
import type { Prisma } from '@prisma/client'

// ── Types ──────────────────────────────────────────────────

export interface ProductFilters {
  categoryId?: string
  brandId?: string
  search?: string
  isFeatured?: boolean
  isOnSale?: boolean
  isNewArrival?: boolean
  page?: number
  limit?: number
}

export interface ProductListItem {
  id: string
  sku: string
  name: string
  slug: string
  shortDescription: string | null
  price: number
  comparePrice: number | null
  stock: number
  images: string[]
  rating: number
  reviewCount: number
  isFeatured: boolean
  isOnSale: boolean
  isNewArrival: boolean
  brand: { id: string; name: string; slug: string; logo: string | null } | null
  category: { id: string; name: string; slug: string } | null
}

export interface ProductDetail extends ProductListItem {
  description: string | null
  specs: Record<string, string>
  technicalSheetUrl: string | null
  videoUrl: string | null
  reviews: ReviewItem[]
}

export interface ReviewItem {
  id: string
  rating: number
  title: string | null
  comment: string | null
  createdAt: Date
}

export interface PaginatedProducts {
  products: ProductListItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface BrandWithCount {
  id: string
  name: string
  slug: string
  logo: string | null
  featured: boolean
  _count: { products: number }
}

export interface BrandDetail {
  id: string
  name: string
  slug: string
  logo: string | null
  featured: boolean
  products: ProductListItem[]
}

export interface CategoryWithChildren {
  id: string
  name: string
  slug: string
  parentId: string | null
  image: string | null
  icon: string | null
  order: number
  children: CategoryWithChildren[]
}

// ── Helpers ────────────────────────────────────────────────

function parseImages(imagesJson: string): string[] {
  try {
    const parsed = JSON.parse(imagesJson)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function parseSpecs(specsJson: string): Record<string, string> {
  try {
    const parsed = JSON.parse(specsJson)
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
      ? parsed
      : {}
  } catch {
    return {}
  }
}

const PRODUCT_LIST_SELECT = {
  id: true,
  sku: true,
  name: true,
  slug: true,
  shortDescription: true,
  price: true,
  comparePrice: true,
  stock: true,
  images: true,
  rating: true,
  reviewCount: true,
  isFeatured: true,
  isOnSale: true,
  isNewArrival: true,
  brand: { select: { id: true, name: true, slug: true, logo: true } },
  category: { select: { id: true, name: true, slug: true } },
} satisfies Prisma.ProductSelect

function mapProductListItem(product: {
  id: string
  sku: string
  name: string
  slug: string
  shortDescription: string | null
  price: number
  comparePrice: number | null
  stock: number
  images: string
  rating: number
  reviewCount: number
  isFeatured: boolean
  isOnSale: boolean
  isNewArrival: boolean
  brand: { id: string; name: string; slug: string; logo: string | null } | null
  category: { id: string; name: string; slug: string } | null
}): ProductListItem {
  return {
    ...product,
    images: parseImages(product.images),
  }
}

// ── Actions ────────────────────────────────────────────────

export async function getProducts(
  filters?: ProductFilters,
): Promise<PaginatedProducts> {
  try {
    const page = filters?.page ?? 1
    const limit = filters?.limit ?? 12
    const skip = (page - 1) * limit

    const where: Prisma.ProductWhereInput = {
      isPublished: true,
    }

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId
    }
    if (filters?.brandId) {
      where.brandId = filters.brandId
    }
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { sku: { contains: filters.search } },
        { description: { contains: filters.search } },
      ]
    }
    if (filters?.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured
    }
    if (filters?.isOnSale !== undefined) {
      where.isOnSale = filters.isOnSale
    }
    if (filters?.isNewArrival !== undefined) {
      where.isNewArrival = filters.isNewArrival
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: PRODUCT_LIST_SELECT,
      }),
      db.product.count({ where }),
    ])

    return {
      products: products.map(mapProductListItem),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return { products: [], total: 0, page: 1, limit: 12, totalPages: 0 }
  }
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductDetail | null> {
  try {
    const product = await db.product.findUnique({
      where: { slug },
      include: {
        brand: { select: { id: true, name: true, slug: true, logo: true } },
        category: { select: { id: true, name: true, slug: true, parentId: true } },
        reviews: {
          select: {
            id: true,
            rating: true,
            title: true,
            comment: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!product) return null

    return {
      id: product.id,
      sku: product.sku,
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription,
      price: product.price,
      comparePrice: product.comparePrice,
      stock: product.stock,
      images: parseImages(product.images),
      specs: parseSpecs(product.specs),
      rating: product.rating,
      reviewCount: product.reviewCount,
      isFeatured: product.isFeatured,
      isOnSale: product.isOnSale,
      isNewArrival: product.isNewArrival,
      description: product.description,
      technicalSheetUrl: product.technicalSheetUrl,
      videoUrl: product.videoUrl,
      brand: product.brand
        ? { id: product.brand.id, name: product.brand.name, slug: product.brand.slug, logo: product.brand.logo }
        : null,
      category: product.category
        ? { id: product.category.id, name: product.category.name, slug: product.category.slug }
        : null,
      reviews: product.reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        createdAt: r.createdAt,
      })),
    }
  } catch (error) {
    console.error('Error fetching product by slug:', error)
    return null
  }
}

export async function getFeaturedProducts(
  limit: number = 8,
): Promise<ProductListItem[]> {
  try {
    const products = await db.product.findMany({
      where: { isPublished: true, isFeatured: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: PRODUCT_LIST_SELECT,
    })
    return products.map(mapProductListItem)
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
}

export async function getOnSaleProducts(
  limit: number = 8,
): Promise<ProductListItem[]> {
  try {
    const products = await db.product.findMany({
      where: { isPublished: true, isOnSale: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: PRODUCT_LIST_SELECT,
    })
    return products.map(mapProductListItem)
  } catch (error) {
    console.error('Error fetching on-sale products:', error)
    return []
  }
}

export async function getNewArrivals(
  limit: number = 8,
): Promise<ProductListItem[]> {
  try {
    const products = await db.product.findMany({
      where: { isPublished: true, isNewArrival: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: PRODUCT_LIST_SELECT,
    })
    return products.map(mapProductListItem)
  } catch (error) {
    console.error('Error fetching new arrivals:', error)
    return []
  }
}

export async function getAllBrands(): Promise<BrandWithCount[]> {
  try {
    const brands = await db.brand.findMany({
      include: {
        _count: {
          select: { products: { where: { isPublished: true } } },
        },
      },
      orderBy: { name: 'asc' },
    })
    return brands.map((b) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      logo: b.logo,
      featured: b.featured,
      _count: b._count,
    }))
  } catch (error) {
    console.error('Error fetching brands:', error)
    return []
  }
}

export async function getBrandBySlug(slug: string): Promise<BrandDetail | null> {
  try {
    const brand = await db.brand.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isPublished: true },
          select: PRODUCT_LIST_SELECT,
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!brand) return null

    return {
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      logo: brand.logo,
      featured: brand.featured,
      products: brand.products.map(mapProductListItem),
    }
  } catch (error) {
    console.error('Error fetching brand by slug:', error)
    return null
  }
}

export async function getCategoriesWithChildren(): Promise<CategoryWithChildren[]> {
  try {
    const categories = await db.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: true,
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    })

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parentId,
      image: cat.image,
      icon: cat.icon,
      order: cat.order,
      children: cat.children.map((child) => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
        parentId: child.parentId,
        image: child.image,
        icon: child.icon,
        order: child.order,
        children: child.children.map((grandchild) => ({
          id: grandchild.id,
          name: grandchild.name,
          slug: grandchild.slug,
          parentId: grandchild.parentId,
          image: grandchild.image,
          icon: grandchild.icon,
          order: grandchild.order,
          children: [],
        })),
      })),
    }))
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function getProductsByBrandSlug(
  brandSlug: string,
): Promise<ProductListItem[]> {
  try {
    const brand = await db.brand.findUnique({
      where: { slug: brandSlug },
      select: { id: true },
    })

    if (!brand) return []

    const products = await db.product.findMany({
      where: { brandId: brand.id, isPublished: true },
      orderBy: { createdAt: 'desc' },
      select: PRODUCT_LIST_SELECT,
    })

    return products.map(mapProductListItem)
  } catch (error) {
    console.error('Error fetching products by brand slug:', error)
    return []
  }
}