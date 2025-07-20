# 驗證功能建議

本文件概述了當前驗證系統的狀態，並為基於 Supabase 的 Serverless 架構提供了改進建議。

## 目前實作狀態

*   **註冊:** 使用者可以使用電子郵件、密碼和使用者名稱進行註冊。使用者名稱儲存在 `user_metadata` 中。
*   **登入:** 使用者可以使用電子郵件和密碼登入。
*   **客戶端 (Client-side):** `AuthForm.tsx` 組件處理登入和註冊表單，包含基本的驗證，例如檢查密碼是否相符。
*   **伺服器端 (Server-side):**
    *   已建立註冊 (`/api/auth/signup/route.ts`) 和登入 (`/api/auth/login/route.ts`) 的 API 路由。
    *   已正確設定用於伺ervidor端和客戶端的 Supabase 客戶端。
*   **中介軟體 (Middleware):** `middleware.ts` 已設定用於保護路由和管理會話 (Session)。

## 待改進及缺失功能

1.  **登出功能:**
    *   **建議:** 建立一個 `/api/auth/logout` 的 API 路由，使用 `POST` 方法。該路由會呼叫 Supabase 的 `auth.signOut()` 方法來清除伺服器端的 session。在前端，Navbar 上的「登出」按鈕應觸發對此 API 的請求。

2.  **密碼重設:**
    *   **建議:**
        *   **UI:** 建立一個新的頁面 `app/auth/forgot-password/page.tsx`，包含一個表單讓使用者輸入他們的電子郵件地址。
        *   **API:** 建立 `/api/auth/reset-password` 路由。此路由接收使用者的電子郵件，並呼叫 Supabase 的 `auth.resetPasswordForEmail()` 方法。
        *   **流程:** Supabase 會向使用者發送一封包含重設連結的郵件。使用者點擊連結後，會被導向到一個由 Supabase 處理或自訂的密碼更新頁面。

3.  **使用者資料管理:**
    *   **建議:**
        *   **UI:** 建立一個使用者個人資料頁面 `app/profile/page.tsx`，讓使用者可以查看並更新他們的使用者名稱等資訊。
        *   **API:** 建立 `/api/user` 路由，使用 `PUT` 或 `PATCH` 方法，允許使用者更新其 `user_metadata`。

4.  **電子郵件驗證流程:**
    *   **建議:**
        *   **API:** 建立一個 `/api/auth/callback` 路由。當使用者點擊 Supabase 發送的驗證郵件中的連結時，他們會被重新導向到這個路由。
        *   **流程:** 此回呼路由負責處理驗證權杖，並可將使用者重新導向到一個「驗證成功」的頁面，提升使用者體驗。

5.  **第三方登入 (OAuth):**
    *   **建議:**
        *   **UI:** 在 `AuthForm.tsx` 組件中，加入「使用 Google 登入」、「使用 GitHub 登入」等按鈕。
        *   **流程:** 點擊按鈕後，前端直接呼叫 Supabase 的 `auth.signInWithOAuth()` 方法，並傳入對應的提供商（'google', 'github' 等）。Supabase 會處理整個 OAuth 流程。

6.  **錯誤處理與使用者回饋:**
    *   **建議:** 導入一個輕量的提示庫（如 `react-hot-toast`），或建立一個全域的 `Alert` 組件。當 API 呼叫失敗或成功時，提供清晰、一致的視覺回饋。

7.  **會話管理 (Session Management):**
    *   **建議:** 雖然 Supabase 的 `cookie` 儲存預設提供了持久性會話，但可以在登入表單中提供一個「記住我」的選項，以允許使用者選擇更長的會話有效期（若業務需要）。

8.  **基於角色的存取控制 (RBAC):**
    *   **建議:** 在 `middleware.ts` 中，除了檢查使用者是否登入外，對於 `/admin` 路徑，還需從 `public.profiles` 表中查詢當前使用者的 `is_admin` 欄位，確保其為 `true`。這是保護後台的關鍵。

9.  **UI/UX 改善:**
    *   **字體顏色:** 當前部分頁面的字體顏色過淺，影響閱讀體驗，需要進行調整。
