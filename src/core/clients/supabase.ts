import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient<PrismaClient>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default supabase;
