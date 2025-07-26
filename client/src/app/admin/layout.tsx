import { createSupabaseServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServer();
  const { data: { user }, error } = await supabase.auth.getUser();

  // 如果沒有用戶或認證錯誤，重定向到登入頁面
  if (!user || error) {
    redirect("/auth");
  }

  // 檢查用戶是否為管理員
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("user_id", user.id)  // 修正：使用 user_id 而不是 id
    .single();

  // 如果查詢失敗或用戶不是管理員，重定向到首頁
  if (profileError || !profile?.is_admin) {
    redirect("/");
  }

  return <>{children}</>;
}
