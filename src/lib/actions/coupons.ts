'use server'

import { db } from '@/lib/db'

// ── Types ──────────────────────────────────────────────────

export interface CouponDetail {
  id: string
  code: string
  type: string
  value: number
  minOrder: number | null
  maxUses: number | null
  usedCount: number
  expiresAt: Date | null
  isActive: boolean
}

export interface ValidateCouponResult {
  valid: boolean
  coupon?: CouponDetail
  discountAmount?: number
  error?: string
}

// ── Actions ────────────────────────────────────────────────

export async function validateCoupon(
  code: string,
  orderTotal: number,
): Promise<ValidateCouponResult> {
  try {
    const normalizedCode = code.toUpperCase().trim()

    const coupon = await db.coupon.findUnique({
      where: { code: normalizedCode },
    })

    if (!coupon) {
      return { valid: false, error: 'Cupón no encontrado.' }
    }

    // Check if active
    if (!coupon.isActive) {
      return { valid: false, error: 'Este cupón no está activo.' }
    }

    // Check if expired
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return { valid: false, error: 'Este cupón ha expirado.' }
    }

    // Check usage limit
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      return { valid: false, error: 'Este cupón ha alcanzado su límite de usos.' }
    }

    // Check minimum order
    if (coupon.minOrder !== null && orderTotal < coupon.minOrder) {
      return {
        valid: false,
        error: `El pedido mínimo para este cupón es S/ ${coupon.minOrder.toFixed(2)}.`,
      }
    }

    // Calculate discount
    let discountAmount = 0
    if (coupon.type === 'PERCENTAGE') {
      discountAmount = (orderTotal * coupon.value) / 100
    } else if (coupon.type === 'FIXED') {
      discountAmount = coupon.value
    }

    return {
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minOrder: coupon.minOrder,
        maxUses: coupon.maxUses,
        usedCount: coupon.usedCount,
        expiresAt: coupon.expiresAt,
        isActive: coupon.isActive,
      },
      discountAmount,
    }
  } catch (error) {
    console.error('Error validating coupon:', error)
    return { valid: false, error: 'Error al validar el cupón.' }
  }
}