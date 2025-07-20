# 商店 (Shop) 功能開發計畫

## 1. 核心功能

### 1.1. 商店主頁 (`/shop`)

*   **功能描述:** 顯示所有已上架的遊戲，讓使用者可以瀏覽。
*   **資料來源:** 從 Supabase 的 `games` 資料表中獲取所有遊戲資料。
*   **頁面實作:**
    *   在 `client/src/app/shop/page.tsx` 中，使用 Supabase client 直接獲取 `games` 的資料。
    *   為每個遊戲建立一個卡片式 UI (`GameCard`)，顯示遊戲名稱、圖片和簡介。
    *   每個遊戲卡片都可以點擊，並將使用者導向至該遊戲專屬的儲值頁面 (`/shop/[game_id]`)。

### 1.2. 遊戲儲值頁 (`/shop/[game_id]`)

*   **功能描述:** 顯示特定遊戲的詳細資訊以及所有可用的儲值選項。
*   **資料來源:**
    *   從 URL 的 `[game_id]` 參數獲取當前遊戲的 ID。
    *   使用遊戲 ID 從 `games` 資料表獲取該遊戲的詳細資料。
    *   使用遊戲 ID 從 `game_options` (或類似名稱的資料表) 獲取所有相關的儲值選項。
*   **頁面實作:**
    *   建立動態路由頁面 `client/src/app/shop/[game_id]/page.tsx`。
    *   在頁面中獲取遊戲和其對應的儲值選項資料。
    *   顯示遊戲的詳細資訊 (如橫幅、描述)。
    *   將儲值選項渲染成一個列表或表單，供使用者選擇。

## 2. 需要建立的檔案

*   `docs/shop.md` (本文件)
*   `client/src/app/shop/[game_id]/page.tsx` (遊戲儲值頁)
*   `client/src/components/shop/GameCard.tsx` (商店主頁的遊戲卡片組件)
*   `client/src/components/shop/OrderForm.tsx` (遊戲儲值頁的下單表單)

## 3. 資料庫 Schema (建議)

請確保您的 Supabase 資料庫有類似以下的資料表結構：

**games**

| 欄位 | 類型 | 描述 |
| :--- | :--- | :--- |
| id | uuid | Primary Key |
| name | text | 遊戲名稱 |
| description | text | 遊戲描述 |
| image_url | text | 遊戲圖片 URL |
| created_at | timestampz | |

**game_options**

| 欄位 | 類型 | 描述 |
| :--- | :--- | :--- |
| id | uuid | Primary Key |
| game_id | uuid | Foreign Key to `games.id` |
| name | text | 儲值選項名稱 (例如 "1000 鑽石") |
| price | numeric | 價格 |
| created_at | timestampz | |

