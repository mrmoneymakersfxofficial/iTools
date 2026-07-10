'use server'

import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth-utils'
import { revalidatePath } from 'next/cache'

// ── Types ──────────────────────────────────────────────────

export interface RegisterResult {
  success: boolean
  user?: {
    id: string
    name: string | null
    email: string
    role: string
    phone: string | null
  }
  error?: string
}

export interface UpdateProfileResult {
  success: boolean
  user?: {
    id: string
    name: string | null
    email: string
    role: string
    phone: string | null
  }
  error?: string
}

// ── Actions ────────────────────────────────────────────────

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<RegisterResult> {
  try {
    const normalizedEmail = email.toLowerCase().trim()

    // Check for existing email
    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail },
    })

    if (existingUser) {
      return { success: false, error: 'Ya existe una cuenta con este correo electrónico.' }
    }

    const passwordHash = await hashPassword(password)

    const user = await db.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
      },
    })

    revalidatePath('/')
    return { success: true, user }
  } catch (error) {
    console.error('Error registering user:', error)
    return { success: false, error: 'Error al crear la cuenta. Inténtalo de nuevo.' }
  }
}

export async function updateProfile(
  userId: string,
  data: { name?: string; phone?: string },
): Promise<UpdateProfileResult> {
  try {
    const updateData: { name?: string | null; phone?: string | null } = {}

    if (data.name !== undefined) {
      updateData.name = data.name.trim() || null
    }
    if (data.phone !== undefined) {
      updateData.phone = data.phone.trim() || null
    }

    const user = await db.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
      },
    })

    revalidatePath('/cuenta')
    return { success: true, user }
  } catch (error) {
    console.error('Error updating profile:', error)
    return { success: false, error: 'Error al actualizar el perfil.' }
  }
}