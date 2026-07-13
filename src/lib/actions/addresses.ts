'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

// ── Types ──────────────────────────────────────────────────

export interface AddressItem {
  id: string
  userId: string
  label: string | null
  street: string
  city: string
  state: string | null
  zip: string | null
  country: string
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AddressInput {
  label?: string
  street: string
  city: string
  state?: string
  zip?: string
  country?: string
}

export interface AddressResult {
  success: boolean
  address?: AddressItem
  error?: string
}

// ── Actions ────────────────────────────────────────────────

export async function getAddresses(userId: string): Promise<AddressItem[]> {
  try {
    const addresses = await db.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    })
    return addresses
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return []
  }
}

export async function addAddress(
  userId: string,
  data: AddressInput,
): Promise<AddressResult> {
  try {
    // Check if this is the user's first address
    const addressCount = await db.address.count({
      where: { userId },
    })

    const isDefault = addressCount === 0

    const address = await db.address.create({
      data: {
        userId,
        label: data.label?.trim() || null,
        street: data.street.trim(),
        city: data.city.trim(),
        state: data.state?.trim() || null,
        zip: data.zip?.trim() || null,
        country: data.country?.trim() || 'PE',
        isDefault,
      },
    })

    revalidatePath('/cuenta/direcciones')
    return { success: true, address }
  } catch (error) {
    console.error('Error adding address:', error)
    return { success: false, error: 'Error al agregar la dirección.' }
  }
}

export async function updateAddress(
  addressId: string,
  userId: string,
  data: Partial<AddressInput>,
): Promise<AddressResult> {
  try {
    // Verify ownership
    const existing = await db.address.findUnique({
      where: { id: addressId },
    })

    if (!existing || existing.userId !== userId) {
      return { success: false, error: 'Dirección no encontrada.' }
    }

    const updateData: {
      label?: string | null
      street?: string
      city?: string
      state?: string | null
      zip?: string | null
      country?: string
    } = {}

    if (data.label !== undefined) {
      updateData.label = data.label.trim() || null
    }
    if (data.street !== undefined) {
      updateData.street = data.street.trim()
    }
    if (data.city !== undefined) {
      updateData.city = data.city.trim()
    }
    if (data.state !== undefined) {
      updateData.state = data.state.trim() || null
    }
    if (data.zip !== undefined) {
      updateData.zip = data.zip.trim() || null
    }
    if (data.country !== undefined) {
      updateData.country = data.country.trim() || 'PE'
    }

    const address = await db.address.update({
      where: { id: addressId },
      data: updateData,
    })

    revalidatePath('/cuenta/direcciones')
    return { success: true, address }
  } catch (error) {
    console.error('Error updating address:', error)
    return { success: false, error: 'Error al actualizar la dirección.' }
  }
}

export async function deleteAddress(
  addressId: string,
  userId: string,
): Promise<AddressResult> {
  try {
    // Verify ownership
    const existing = await db.address.findUnique({
      where: { id: addressId },
    })

    if (!existing || existing.userId !== userId) {
      return { success: false, error: 'Dirección no encontrada.' }
    }

    const wasDefault = existing.isDefault

    await db.address.delete({
      where: { id: addressId },
    })

    // If the deleted address was the default, set the most recent one as default
    if (wasDefault) {
      const nextAddress = await db.address.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      })

      if (nextAddress) {
        await db.address.update({
          where: { id: nextAddress.id },
          data: { isDefault: true },
        })
      }
    }

    revalidatePath('/cuenta/direcciones')
    return { success: true }
  } catch (error) {
    console.error('Error deleting address:', error)
    return { success: false, error: 'Error al eliminar la dirección.' }
  }
}

export async function setDefaultAddress(
  addressId: string,
  userId: string,
): Promise<AddressResult> {
  try {
    // Verify ownership
    const existing = await db.address.findUnique({
      where: { id: addressId },
    })

    if (!existing || existing.userId !== userId) {
      return { success: false, error: 'Dirección no encontrada.' }
    }

    // Unset all other defaults for this user
    await db.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    })

    // Set the target address as default
    const address = await db.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    })

    revalidatePath('/cuenta/direcciones')
    return { success: true, address }
  } catch (error) {
    console.error('Error setting default address:', error)
    return { success: false, error: 'Error al establecer la dirección predeterminada.' }
  }
}