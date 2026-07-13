import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { getServerSession as getNextAuthServerSession } from "next-auth"
import { db } from "@/lib/db"
import { verifyPassword } from "@/lib/password"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const isValid = await verifyPassword(credentials.password, user.passwordHash)

        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "placeholder-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "placeholder-client-secret",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id!
        token.role = (user as { role?: string }).role ?? "CUSTOMER"
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId
        session.user.role = token.role
      }
      return session
    },
  },
}

// Convenience re-export of getServerSession bound to our authOptions
export const getServerSession = () => getNextAuthServerSession(authOptions)

export default authOptions