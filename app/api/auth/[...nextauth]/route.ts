import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

const client = new MongoClient(process.env.MONGODB_URI!)
const clientPromise = client.connect()

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: "zeebundu"
  }),
  providers: [
    CredentialsProvider({
      name: "Admin Credentials",
      credentials: {
        email: { 
          label: "Email", 
          type: "email",
          placeholder: "admin@zeebundu.com" 
        },
        password: { 
          label: "Password", 
          type: "password" 
        }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const client = await clientPromise
          const db = client.db("zeebundu")
          
          // Find admin user by email
          const adminUser = await db.collection("admin_users").findOne({
            email: credentials.email
          })

          if (!adminUser) {
            console.log("Admin user not found:", credentials.email)
            return null
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, adminUser.password)
          
          if (!isPasswordValid) {
            console.log("Invalid password for:", credentials.email)
            return null
          }

          // Return user object
          return {
            id: adminUser._id.toString(),
            email: adminUser.email,
            name: adminUser.name,
            role: adminUser.role || "admin"
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: { 
    strategy: "jwt" as const,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      // Add role to JWT token
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      // Add role to session
      if (token) {
        session.user.role = token.role as string
        session.user.id = token.id as string
      }
      return session
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Redirect to admin dashboard after successful login
      if (url.startsWith("/admin/login") || url === "/admin") {
        return `${baseUrl}/admin`
      }
      return url.startsWith(baseUrl) ? url : baseUrl
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }