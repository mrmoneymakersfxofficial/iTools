'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

// ── Types ──────────────────────────────────────────────────

export interface WishlistItem {
  id: string
  productId: string
  createdAt: Date
  product: {
    id: string
    name: string
    slug: string
    price: number
    comparePrice: number | null
    stock: number
    images: string[]
    isOnSale: boolean
    isPublished: boolean
    brand: { id: string; name: string; slug: string } | null
  }
}

export interface WishlistResult {
  success: boolean
  error?: string
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

// ── Actions ────────────────────────────────────────────────

export async function getWishlist(userId: string): Promise<WishlistItem[]> {
  try {
    const wishlist = await db.wishlist.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            comparePrice: true,
            stock: true,
            images: true,
            isOnSale: true,
            isPublished: true,
            brand: {
              select: { id: true, name: true, slug: true },
            },
          },
        },
      },
    })

    return wishlist.map((item) => ({
      id: item.id,
      productId: item.productId,
      createdAt: item.createdAt,
      product: {
        ...item.product,
        images: parseImages(item.product.images),
      },
    }))
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return []
  }
}

export async function addToWishlist(
  userId: string,
  productId: string,
): Promise<WishlistResult> {
  try {
    // Check if already in wishlist (handle duplicate)
    const existing = await db.wishlist.findUnique({
      where: { userId_productId: { userId, productId } },
    })

    if (existing) {
      return { success: true } // Already in wishlist, no error
    }

    await db.wishlist.create({
      data: { userId, productId },
    })

    revalidatePath('/cuenta/favoritos')
    revalidatePath('/producto/[slug]')
    return { success: true }
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return { success: false, error: 'Error al agregar a favoritos.' }
  }
}

export async function removeFromWishlist(
  userId: string,
  productId: string,
): Promise<WishlistResult> {
  try {
    await db.wishlist.deleteMany({
      where: { userId, productId },
    })

    revalidatePath('/cuenta/favoritos')
    revalidatePath('/producto/[slug]')
    return { success: true }
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return { success: false, error: 'Error al eliminar de favoritos.' }
  }
}

export async function isInWishlist(
  userId: string,
  productId: string,
): Promise<boolean> {
  try {
    const item = await db.wishlist.findUnique({
      where: { userId_productId: { userId, productId } },
      select: { id: true },
    })
    return !!item
  } catch (error) {
    console.error('Error checking wishlist:', error)
    return false
  }
}