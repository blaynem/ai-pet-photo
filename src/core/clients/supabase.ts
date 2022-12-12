import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = (supabaseAccessToken: string) =>
  createClient<PrismaClient>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${supabaseAccessToken}`,
        },
      },
    }
  );

export default supabase;
