# Admin 後台功能建議

本文件分析了 Admin 後台的現況，並提供了功能改進與新增的建議。所有後端邏輯都將基於 **Vercel + Supabase** 的 Serverless 架構實現。

## 一、現有功能盤點

目前 Admin 後台已具備以下功能的 UI 雛形，但皆為**前端靜態頁面**，尚未與後端資料庫整合。

1.  **儀表板 (`/admin`):**
    *   提供總訂單、總收入、活躍遊戲等靜態統計數據卡片。
    *   包含每日訂單趨勢、熱門遊戲排行的圖表佔位符。

2.  **遊戲管理 (`/admin/games`):** (已重構)
    *   提供新增、刪除、啟用/停用遊戲的 UI 介面。

3.  **橫幅管理 (`/admin/banners`):** (已重構)
    *   提供新增、刪除、啟用/停用橫幅的 UI 介面。

## 二、核心待辦事項 (與後端整合)

目前所有 Admin 功能皆為前端靜態操作，首要任務是將其與 Supabase 後端整合。

*   **串接 API:** 將儀表板、遊戲管理、橫幅管理頁面的所有 `useState` 假資料，改為透過 `fetch` 呼叫後端 API (`/api/games`, `/api/orders` 等) 來取得與更新資料。
*   **權限控制:**
    *   **資料庫來源:** 管理員身份由 `public.profiles` 資料表中的 `is_admin` 欄位決定。
    *   **驗證流程:** 所有 `/admin` 路徑下的頁面與 API 都必須加上權限驗證。在 Serverless 環境中，這通常在 Middleware (`middleware.ts`) 或每個 API 路由的開頭進行檢查。

## 三、功能模組與資料庫對應

### 1. 遊戲管理 (Game Management) - (已完成)
*   **功能:** 新增、刪除、啟用/停用遊戲，設定遊戲分類和圖標。
*   **相關資料表:** `public.game`
*   **檔案:**
    *   頁面: `client/src/app/admin/games/page.tsx`
    *   API: `client/src/app/api/games/route.ts`

### 2. 橫幅管理 (Banner Management) - (已完成)
*   **功能:** 新增、刪除、啟用/停用首頁或其他頁面的橫幅。
*   **相關資料表:** `public.banner`
*   **檔案:**
    *   頁面: `client/src/app/admin/banners/page.tsx`
    *   API: `client/src/app/api/banners/route.ts`

### 3. 訂單管理 (Order Management) - (已完成)
*   **功能:** 顯示、搜尋、查看所有訂單的詳細資訊，並可更新訂單狀態。
*   **相關資料表:** `public.order`, `public.game`, `public.profiles`
*   **檔案:**
    *   頁面: `client/src/app/admin/orders/page.tsx`
    *   API: `client/src/app/api/orders/route.ts`

### 4. 付款方式管理 (Payment Method Management) - (已完成)
*   **功能:** 列表、新增、編輯、刪除支援的付款方式。
*   **相關資料表:** `public.payment_method`
*   **檔案:**
    *   頁面: `client/src/app/admin/payments/page.tsx`
    *   API: `client/src/app/api/payments/route.ts`

### 5. 報表與分析 (Reporting & Analytics) - (規劃中)

此功能旨在提供有價值的業務洞察，而非僅僅是數據的羅列。

#### 5.1. 高價值客戶分析 (Top Customers Analysis)

*   **目標:** 找出消費金額或頻次最高的客戶，以進行精準行銷或提供 VIP 服務。
*   **頁面:** `client/src/app/admin/reports/page.tsx`
*   **呈現方式:**
    *   **上方 (視覺化圖表):**
        *   **圖表類型:** 採用**垂直長條圖 (Vertical Bar Chart)**，最適合比較不同用戶的消費總額。
        *   **X 軸:** 使用者名稱。
        *   **Y 軸:** 總消費金額。
        *   **內容:** 預設顯示消費金額前 10 名的用戶。
    *   **下方 (詳細資料表格):**
        *   **欄位:** `排名`, `使用者`, `總消費金額`, `總訂單數`, `平均訂單金額`, `最近購買日期`。
        *   **功能:** 所有欄位均可點擊排序。
*   **互動式篩選:**
    *   **日期範圍篩選器:** 可選擇「最近 7 天」、「最近 30 天」、「本月」、「所有時間」或自訂日期範圍。
    *   **遊戲篩選器:** 一個下拉選單，可選擇「所有遊戲」或單一特定遊戲。所有篩選條件變動時，上方圖表和下方表格的數據會同步更新。

#### 5.2. Serverless 架構下的實現策略

*   **後端 API (`/api/reports/top-customers/route.ts`):**
    *   這將是一個 **GET** 端點，負責接收前端傳來的 `date_range` 和 `game_id` 篩選參數。
    *   **核心邏輯:** 在 Serverless Function 中，使用 Supabase 的 PostgREST API 或 RPC (遠端程序呼叫) 執行一個**單一、高效的 SQL 查詢**。這個查詢會直接在資料庫層級完成所有必要的過濾、分組 (`GROUP BY user_id`)、加總 (`SUM(amount)`) 和排序 (`ORDER BY`) 操作。
    *   **優勢:** 這種方式極大化地利用了 PostgreSQL 的強大數據處理能力。它避免了在 Node.js 環境中手動遍歷大量訂單數據，從而降低了 Serverless Function 的**記憶體消耗**和**執行時間**，這對於控制成本和提升效能至關重要。
*   **前端 (`/admin/reports/page.tsx`):**
    *   使用 `useState` 來管理篩選條件 (`dateRange`, `selectedGame`)。
    *   使用 `useEffect` 來監聽篩選條件的變化。當條件改變時，向後端 API 發送帶有查詢參數的 `fetch` 請求 (例如: `/api/reports/top-customers?gameId=3&from=2025-07-01`)。
    *   使用輕量的圖表庫（如 `recharts` 或 `chart.js`）來渲染後端回傳的數據。