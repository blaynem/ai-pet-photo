import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      // The user's id.
      id: string;
      // The user's credits balance for training models and running predictions.
      credits: number;
    } & DefaultSession["user"];
  }
  interface User {
    credits: number;
  }
}
