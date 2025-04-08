import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth/next";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login"
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
