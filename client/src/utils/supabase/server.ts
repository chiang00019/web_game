
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createSupabaseServer = async () => {
  const cookieStore = await cookies()
  return createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          // 在伺服器端，我們只讀取 cookies，不設置它們
          // 這避免了 "Cookies can only be modified in a Server Action or Route Handler" 錯誤
        },
      },
    },
  );
};
