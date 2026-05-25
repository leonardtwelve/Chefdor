import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.toLowerCase();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/connexion",
    verifyRequest: "/connexion/verifier",
  },
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.RESEND_FROM ?? "Chefdor Cakes <onboarding@resend.dev>",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!ADMIN_EMAIL) return false;
      return user.email?.toLowerCase() === ADMIN_EMAIL;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
