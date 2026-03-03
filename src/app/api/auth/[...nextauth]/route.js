import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    // ✅ Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),

    // ✅ Facebook
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "public_profile"
        }
      }
    }),

    // ✅ Manual Email/Password
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {

        const res = await fetch("http://localhost:8000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        })

        const user = await res.json()

        if (!res.ok || !user) {
          return null
        }

        return user
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      // Jika login dengan Google atau Facebook, simpan ke database
      if (account.provider === "google" || account.provider === "facebook") {
        try {
          const res = await fetch("http://localhost:8000/oauth-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              username: user.name || profile?.name,
              provider: account.provider
            }),
          })

          if (res.ok) {
            const userData = await res.json()
            user.id = userData.id
          }
        } catch (error) {
          console.error("Error saving OAuth user:", error)
        }
      }
      return true
    },
    async redirect({ url, baseUrl }) {
      // Redirect ke /chat setelah login berhasil
      if (url.startsWith(baseUrl)) return `${baseUrl}/chat`
      else if (url.startsWith("/")) return `${baseUrl}/chat`
      return baseUrl
    }
  },

  pages: {
    signIn: '/signin',
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }