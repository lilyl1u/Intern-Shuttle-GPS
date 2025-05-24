import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

console.log("SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL); // Works!
console.log("SERVICE ROLE KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY); // 🔥 undefined on client!
