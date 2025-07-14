# Admin 後台功能建議

本文件分析了 Admin 後台的現況，並提供了功能改進與新增的建議。

## 一、現有功能盤點

目前 Admin 後台已具備以下功能的 UI 雛形，但皆為**前端靜態頁面**，尚未與後端資料庫整合。

1.  **儀表板 (`/admin`):**
    *   提供總訂單、總收入、活躍遊戲等靜態統計數據卡片。
    *   包含每日訂單趨勢、熱門遊戲排行的圖表佔位符。
    *   提供前往遊戲管理和橫幅管理的導航連結。

2.  **遊戲管理 (`/admin/edit_games`):**
    *   提供新增、刪除、啟用/停用遊戲的 UI 介面。
    *   可設定遊戲分類 (UID / 手機遊戲) 和圖標 URL。

3.  **橫幅管理 (`/admin/edit_banner`):**
    *   提供新增、刪除、啟用/停用橫幅的 UI 介面。
    *   可設定橫幅的標題、內容與類型。

## 二、核心待辦事項 (與後端整合)

目前所有 Admin 功能皆為前端靜態操作，首要任務是將其與 Supabase 後端整合。

*   **串接 API:** 將儀表板、遊戲管理、橫幅管理頁面的所有 `useState` 假資料，改為透過 `fetch` 呼叫後端 API (`/api/games`, `/api/orders` 等) 來取得與更新資料。
*   **權限控制:** 所有 `/admin` 路徑下的頁面與 API 都必須加上**管理員權限驗證**，確保只有 `is_admin` 為 `true` 的使用者可以存取。

## 三、建議新增功能

除了現有功能外，建議新增以下關鍵模組，讓後台更完整。

### 1. 訂單管理 (Order Management)

這是電商後台最核心的功能之一，目前完全缺失。

*   **功能:**
    *   顯示所有訂單的列表，包含訂單 ID、使用者、遊戲名稱、金額、狀態、時間等。
    *   提供搜尋功能，可依訂單 ID、使用者名稱或遊戲名稱進行搜尋。
    *   可點擊單筆訂單查看詳細資訊 (如 `game_uid`, `game_server` 等)。
    *   (可選) 手動更新訂單狀態（例如：待處理 -> 已完成）。
*   **建議檔案:**
    *   頁面: `client/src/app/admin/orders/page.tsx`
    *   組件: `client/src/components/admin/OrderList.tsx`

### 2. 報表與分析 (Reporting & Analytics)

針對您提出的「想知道是誰會買」的需求，需要建立一個強大的報表頁面。

*   **功能:**
    *   **銷售總覽:** 透過圖表顯示指定時間範圍內（日、週、月）的總收入與總訂單數趨勢。
    *   **熱銷遊戲分析:** 顯示各個遊戲的銷售額與訂單數量排行，找出最受歡迎的遊戲。
    *   **顧客分析 (使用者輪廓):**
        *   **高消費顧客榜:** 列出消費總金額最高的使用者 (user) 列表。
        *   **高頻率顧客榜:** 列出下單次數最頻繁的使用者列表。
        *   點擊使用者後，可以查看該使用者的所有歷史訂單。
*   **建議檔案:**
    *   頁面: `client/src/app/admin/reports/page.tsx` (取代現有的佔位符)
    *   組件: `client/src/components/admin/reports/SalesChart.tsx`, `client/src/components/admin/reports/TopCustomers.tsx`

### 3. 付款方式管理 (Payment Method Management)

讓管理員可以自行增減支援的付款方式。

*   **功能:** 列表、新增、編輯、刪除 `payment_method` 表中的資料。
*   **建議檔案:**
    *   頁面: `client/src/app/admin/payments/page.tsx`
    *   API: `client/src/app/api/payments/route.ts`
