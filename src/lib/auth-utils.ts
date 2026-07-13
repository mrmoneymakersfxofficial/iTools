export { hashPassword, verifyPassword } from "@/lib/password"

import { getServerSession } from "@/lib/auth"

/**
 * Get the current session with typed userId and role.
 * Safe to call from server components, API routes, and server actions.
 * Returns null if the user is not authenticated.
 */
export async function getSession() {
  return getServerSession()
}

/**
 * Require authentication — returns the session if valid, throws otherwise.
 * Use in server components / API routes where auth is required.
 */
export async function requireAuth() {
  const session = await getServerSession()

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  return session
}