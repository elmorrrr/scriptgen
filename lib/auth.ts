import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import CredentialsProvider from "next-auth/providers/credentials"
import { Client } from "postmark"
import bcrypt from "bcrypt"

import { siteConfig } from "@/config/site"
import prisma from "@/lib/prisma"
import { login } from "./prisma/users"

function getCredential(provider: string): {
  id: string
  secret: string
} {
  if (!provider) {
    throw new Error("PROVIDER NOT FOUND")
  }
  provider = provider.trim().toLocaleUpperCase()
  const id = process.env[`${provider}_CLIENT_ID`]
  const secret = process.env[`${provider}_CLIENT_SECRET`]

  if (!id || id.length === 0) {
    throw new Error(`Missing ${provider}_CLIENT_ID`)
  }
  if (!secret || secret.length === 0) {
    throw new Error(`Missing ${provider}_CLIENT_SECRET`)
  }

  return { id, secret }
}

// TODO: Move env vars to env a la t3.
// const postmarkClient = new Client(process.env.POSTMARK_API_TOKEN || "")

export const authOptions: NextAuthOptions = {
  // huh any! I know.
  // This is a temporary fix for prisma client.
  // @see https://github.com/prisma/prisma/issues/16117
  adapter: PrismaAdapter(prisma as any),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GitHubProvider({
      clientId: getCredential("GITHUB").id,
      clientSecret: getCredential("GITHUB").secret,
    }),
    GoogleProvider({
      clientId: getCredential("GOOGLE").id,
      clientSecret: getCredential("GOOGLE").secret,
    }),
    FacebookProvider({
      clientId: getCredential("FACEBOOK").id,
      clientSecret: getCredential("FACEBOOK").secret,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize({ email, password }) {
        // const user = await login(credentials)
        return { email, password }
      },
    }),

    // EmailProvider({
    //   from: process.env.SMTP_FROM,
    //   sendVerificationRequest: async ({ identifier, url, provider }) => {
    //     const user = await db.user.findUnique({
    //       where: {
    //         email: identifier,
    //       },
    //       select: {
    //         emailVerified: true,
    //       },
    //     })

    //     const templateId = user?.emailVerified
    //       ? process.env.POSTMARK_SIGN_IN_TEMPLATE
    //       : process.env.POSTMARK_ACTIVATION_TEMPLATE
    //     if (!templateId) {
    //       throw new Error("Missing template id")
    //     }

    //     const result = await postmarkClient.sendEmailWithTemplate({
    //       TemplateId: parseInt(templateId),
    //       To: identifier,
    //       From: provider.from as string,
    //       TemplateModel: {
    //         action_url: url,
    //         product_name: siteConfig.name,
    //       },
    //       Headers: [
    //         {
    //           // Set this to prevent Gmail from threading emails.
    //           // See https://stackoverflow.com/questions/23434110/force-emails-not-to-be-grouped-into-conversations/25435722.
    //           Name: "X-Entity-Ref-ID",
    //           Value: new Date().getTime() + "",
    //         },
    //       ],
    //     })

    //     if (result.ErrorCode) {
    //       throw new Error(result.Message)
    //     }
    //   },
    // }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const userFromDB = await prisma.user.findUnique({
        where: {
          email: token.email || "",
        },
      })

      if (!userFromDB) {
        if (user) {
          token.id = user?.id
        }
        return token
      }

      return {
        id: userFromDB.id,
        name: userFromDB.name,
        email: userFromDB.email,
        picture: userFromDB.image,
        role: userFromDB.role,
      }
    },
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
        session.user.role = token.role
      }

      return session
    },
  },
}

export default authOptions
