import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { getConfiguredJwtSecret } from "@/lib/auth"

export const authOptions: NextAuthOptions = {
  secret: getConfiguredJwtSecret() || undefined,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/dashboard`
    },
  },
}
