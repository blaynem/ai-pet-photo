import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { NextAuthOptions, Session } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import db from "@/core/db";
import supabase from "@/core/clients/supabase";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier: email, url }) => {
        // Send magic link to user from Supabase.
        await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: url },
        });
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.userId = user.id;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/login?verifyRequest=1",
  },
  secret: process.env.SECRET,
};

export default NextAuth(authOptions);
