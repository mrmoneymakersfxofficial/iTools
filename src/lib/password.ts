import bcrypt from "bcryptjs"

/**
 * Hash a plain-text password using bcryptjs.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

/**
 * Compare a plain-text password against a bcrypt hash.
 */
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}