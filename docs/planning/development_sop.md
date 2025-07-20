# 開發實作標準作業流程 (SOP)

本文件旨在提供一個清晰的開發路線圖，指導開發者根據 `system.md` 的規劃，循序漸進地完成專案功能。

---

## 通用開發原則 (General Development Principles)

*   **樣式框架 (Styling Framework):** 優先使用 [Tailwind CSS](https://tailwindcss.com/) 來進行樣式開發，以確保程式碼風格統一並加速開發流程。
*   **響應式設計 (RWD):** 所有 UI 組件和頁面都必須是響應式的，能夠適應桌面、平板和手機等不同尺寸的螢幕，提供一致且良好的使用者體驗。

---

## Phase 0: 專案初始化與資料庫設定

**目標:** 建立開發環境，並將資料庫結構初始化。

1.  **安裝依賴:**
    ```bash
    npm install
    ```
2.  **設定環境變數:**
    *   複製 `.env.example` (如果有的話) 或手動建立 `.env.local` 檔案。
    *   填入從 Supabase 專案儀表板取得的 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。
3.  **初始化資料庫:**
    *   前往 Supabase 儀表板的 SQL Editor。
    *   複製 `db.sql` 的所有內容並執行，以建立 `games`, `orders`, `is_admin` 等資料表及相關的 RLS 策略。
    *   手動在 `is_admin` 表中將你自己的測試帳號 `user_id` 加入，並將 `is_admin` 設為 `true`，以便測試管理員功能。

---

## Phase 1: 使用者驗證 (Authentication)

**目標:** 建立完整的登入、註冊、登出功能，並整合密碼重設、電子郵件驗證等進階選項。

1.  **建立 Supabase Client:**
    *   在 `lib/supabase/client.ts` 中，建立並導出 Supabase 的客戶端實例。
    *   在 `utils/supabase/middleware.ts` 中，設定中介軟體以處理 server-side 的驗證。
2.  **建立驗證 UI:**
    *   在 `components/auth/` 中建立 `AuthForm.tsx` 組件，包含登入/註冊的表單邏輯。
    *   建立獨立的忘記密碼頁面 (`/auth/forgot-password`)。
    *   在 `app/auth/page.tsx` 中使用 `AuthForm.tsx`，完成驗證頁面。
3.  **實現 API 路由:**
    *   在 `app/api/auth/` 下建立必要的路由 (e.g., `login`, `register`, `logout`, `reset-password`) 來處理 Supabase 的驗證邏輯。
4.  **實現 Navbar 狀態:**
    *   建立一個 Navbar 組件，根據使用者的登入狀態顯示「登入/註冊」或「登出」按鈕。
    *   (可選) 顯示使用者 email。

---

## Phase 2: 商店與遊戲列表

**目標:** 讓所有使用者 (無論是否登入) 都能看到上架的遊戲列表。

1.  **建立遊戲卡片組件:**
    *   在 `components/shop/` 中建立 `GameCard.tsx`，用於顯示單一遊戲的資訊 (名稱、圖片、價格)。
2.  **建立商店主頁:**
    *   在 `app/shop/page.tsx` 中，從 Supabase 的 `games` 表中獲取所有遊戲資料。
    *   使用 `GameCard.tsx` 將所有遊戲渲染出來。
    *   每個遊戲卡片應連結到 `app/shop/[game_id]/page.tsx`。

---

## Phase 3: 管理員後台 - 基礎建設

**目標:** 建立管理員後台的基礎架構，包括佈局和權限控制。

1.  **建立管理員佈局 (Layout):**
    *   建立一個 `app/admin/layout.tsx`，檢查使用者是否為管理員 (`is_admin = true`)。如果不是，則導向到首頁或顯示權限不足的訊息。
2.  **建立共用組件:**
    *   在 `components/admin/` 中建立共用的 UI 組件，如側邊導覽列 (Sidebar)、頁面標題 (PageHeader) 等，供所有管理頁面使用。

---

## Phase 4: 管理員後台 - 核心管理功能

**目標:** 讓管理員可以管理遊戲、訂單、橫幅和付款方式。

1.  **遊戲管理 (Game Management):**
    *   **API:** 在 `app/api/games/route.ts` 中，建立對應的 `GET`, `POST`, `PUT`, `DELETE` 方法。
    *   **UI:** 在 `app/admin/games/page.tsx` 中，建立遊戲列表、新增/編輯表單 (`GameForm.tsx`)。
2.  **訂單管理 (Order Management):**
    *   **API:** 在 `app/api/orders/route.ts` 中，建立管理員專用的 `GET` (所有訂單) 和 `PUT` (更新狀態) 方法。
    *   **UI:** 在 `app/admin/orders/page.tsx` 中，建立訂單列表 (`OrderList.tsx`)，並提供篩選與狀態更新功能。
3.  **橫幅管理 (Banner Management):**
    *   **API:** 在 `app/api/banners/route.ts` 中，建立對應的 `GET`, `POST`, `PUT`, `DELETE` 方法。
    *   **UI:** 在 `app/admin/banners/page.tsx` 中，建立橫幅列表與管理介面。
4.  **付款方式管理 (Payment Method Management):**
    *   **API:** 在 `app/api/payments/route.ts` 中，建立對應的 `GET`, `POST`, `PUT`, `DELETE` 方法。
    *   **UI:** 在 `app/admin/payments/page.tsx` 中，建立付款方式列表與管理介面。

---

## Phase 5: 下訂單功能

**目標:** 讓登入的使用者可以為特定遊戲建立訂單。

1.  **建立訂單表單組件:**
    *   在 `components/shop/` 中建立 `OrderForm.tsx`，讓使用者填寫必要的訂單資訊 (例如：遊戲角色 ID)。
2.  **建立特定遊戲的訂單頁面:**
    *   在 `app/shop/[game_id]/page.tsx` 中，獲取並顯示遊戲詳細資訊，並嵌入 `OrderForm.tsx`。
3.  **建立訂單 API:**
    *   在 `app/api/orders/route.ts` 中建立 `POST` 方法，將訂單寫入 `orders` 表，`status` 預設為 `pending`。

---

## Phase 6: 報表與分析

**目標:** 為管理員提供業務洞察。

1.  **建立報表 API:**
    *   在 `app/api/reports/top-customers/route.ts` 中建立 `GET` 端點，根據篩選條件查詢並回傳高價值客戶數據。
2.  **建立報表 UI:**
    *   在 `app/admin/reports/page.tsx` 中，建立互動式篩選器 (日期、遊戲)。
    *   使用圖表庫 (如 Recharts) 將後端數據視覺化，並在下方顯示詳細的資料表格。

---

## Phase 7: 實現儲值觸發 (Hook)

**目標:** 在訂單狀態被更新為 `paid` 後，觸發後續的儲值腳本。

1.  **修改訂單更新 API:**
    *   在 `app/api/orders/route.ts` 的 `PUT` 方法中，當成功將訂單狀態更新為 `paid` 後，加入觸發邏輯。
2.  **實現觸發邏輯:**
    *   **初步實現:** 可以先用 `console.log` 模擬呼叫。例如: `console.log("Triggering script for game ${order.game_id} with character ${order.game_character}");`
    *   **正式實現:**
        *   研究如何從 Next.js API Route 安全地執行位於 `process/` 目錄下的 Python 腳本。
        *   可能會使用 Node.js 的 `child_process` 模組 (`spawn` 或 `execFile`)。
        *   將訂單相關的必要資訊 (如角色 ID) 作為參數傳遞給 Python 腳本。
        *   **注意:** 這一步的安全性至關重要，需要謹慎處理命令注入等風險。