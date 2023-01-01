import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import db from "@/core/db";
import { getSession } from "next-auth/react";

export const getNextAuthOptions = (req: NextApiRequest) =>
  ({
    adapter: PrismaAdapter(db),
    providers: [
      EmailProvider({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM,
        sendVerificationRequest: async ({ identifier: email, url }) => {
          // Sending link to console for now, we comment this out and send to email later.
          console.log("----sendVerificationRequest", { email, url });
        },
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code",
          },
        },
      }),
    ],
    callbacks: {
      async session({ session, user }) {
        const dbUser = await db.user.findUnique({
          where: { id: user.id },
          select: { credits: true },
        });
        session.user = { ...user, credits: dbUser?.credits! };
        return session;
      },
      async signIn({ user, account, email }) {
        // if user already has sesstion return true
        if (await getSession({ req })) {
          return true;
        }

        // No email provided, return false
        if (!user.email) {
          return false;
        }

        // if a verification request email comes, let it through
        if (account?.provider === "email" && email?.verificationRequest) {
          return true;
        }

        const existingAccount = await db.account.findFirst({
          where: {
            providerAccountId: account?.providerAccountId,
          },
        });

        // if the account exists return true

        if (existingAccount) {
          return true;
        }

        // if the user exists but it does not have accounts, create the account and let it through
        const existingUser = await db.user.findFirst({
          where: {
            email: user.email,
          },
        });

        // if the user exists but doesn't have an account, create the account and let it through
        if (existingUser && account) {
          await db.account.create({
            data: {
              provider: account.provider,
              type: account.type,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              expires_at: account.expires_at,
              scope: account.scope,
              token_type: account.token_type,
              id_token: account.id_token,
              user: {
                connect: {
                  email: user.email ?? "",
                },
              },
            },
          });
          return true;
        }

        //if the user doesn't exist, create the user and account and let it through

        try {
          if (user && account) {
            await db.user.create({
              data: {
                email: user.email,
                name: user.name,
                image: user.image,
                accounts: {
                  create: {
                    provider: account.provider,
                    type: account.type,
                    providerAccountId: account.providerAccountId,
                    access_token: account.access_token,
                    expires_at: account.expires_at,
                    scope: account.scope,
                    token_type: account.token_type,
                    id_token: account.id_token,
                  },
                },
              },
            });
            return true;
          }
        } catch {
          return false;
        }
      },
    },
    pages: {
      signIn: "/login",
      verifyRequest: "/login?verifyRequest=1",
    },
    secret: process.env.SECRET,
  } as NextAuthOptions);

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, getNextAuthOptions(req));
}
