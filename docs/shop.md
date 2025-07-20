# 商店 (Shop) 功能開發計畫

## 1. 核心功能

### 1.1. 商店主頁 (`/shop`)

*   **功能描述:** 顯示所有已上架 (`is_active = true`) 的遊戲，讓使用者可以瀏覽。
*   **資料來源:** 從 Supabase 的 `public.game` 資料表獲取資料。
*   **頁面實作:**
    *   在 `client/src/app/shop/page.tsx` 中，非同步獲取所有遊戲資料。
    *   為每個遊戲建立一個卡片式 UI (`GameCard.tsx`)，應包含遊戲圖片、名稱，並可選擇性顯示簡介或價格範圍。
    *   每個遊戲卡片都是一個連結，將使用者導向至該遊戲專屬的儲值頁面 (`/shop/[game_id]`)。
*   **錯誤處理:**
    *   若無法從後端獲取遊戲資料，頁面應顯示一個錯誤提示，例如「暫時無法載入遊戲列表，請稍後再試」。

### 1.2. 遊戲儲值頁 (`/shop/[game_id]`)

*   **功能描述:** 顯示特定遊戲的詳細資訊以及所有可用的儲值選項，並允許已登入的使用者提交訂單。
*   **資料來源:**
    *   從 URL 的 `[game_id]` 動態參數獲取當前遊戲的 ID。
    *   使用遊戲 ID 從 `public.game` 資料表獲取該遊戲的詳細資料。
    *   使用遊戲 ID 從 `public.game_packages` 資料表獲取所有相關的儲值選項。
*   **頁面實作:**
    *   建立動態路由頁面 `client/src/app/shop/[game_id]/page.tsx`。
    *   頁面載入時，根據 `game_id` 並行獲取遊戲和儲值包的資料。
    *   顯示遊戲的詳細資訊（如橫幅圖片、完整描述）。
    *   若使用者未登入，則顯示「請先登入以進行儲值」的提示訊息，並隱藏訂單表單。
    *   若使用者已登入，則顯示 `OrderForm.tsx` 組件。
*   **錯誤處理:**
    *   如果 `game_id` 無效或在資料庫中不存在，頁面應顯示「找不到該遊戲」的 404 錯誤頁面。

## 2. 核心組件

### 2.1. `OrderForm.tsx` (下單表單)
*   **功能描述:** 這是使用者與訂單功能互動的核心。它應包含選擇儲值包、填寫遊戲角色資訊，並提交訂單的功能。
*   **內部狀態 (State):**
    *   `selectedPackage`: 儲存使用者選擇的儲值包 ID。
    *   `characterId`: 儲存使用者輸入的遊戲角色 ID。
    *   `isLoading`: 用於控制提交按鈕的狀態，防止重複提交。
    *   `error`: 用於顯示表單級別的錯誤訊息。
*   **互動流程:**
    1.  表單預設渲染一個儲值包的列表（建議使用 Radio Button 或 Select 下拉選單），讓使用者選擇。
    2.  提供一個文字輸入框，讓使用者填寫他們的「遊戲角色 ID」。此欄位應有前端驗證，確保不為空。
    3.  提供一個「提交訂單」按鈕。當 `isLoading` 為 `true` 時，此按鈕應被禁用。
    4.  點擊提交後，`isLoading` 設為 `true`。表單收集 `selectedPackage`, `characterId` 等資訊，並向後端 API (`/api/orders`) 發送 `POST` 請求。
    5.  請求成功後，可以選擇清空表單，並呼叫一個全域的成功提示（如 toast）。
    6.  請求失敗後，`isLoading` 設為 `false`，並在表單下方顯示從後端回傳的錯誤訊息。

## 3. 需要建立的檔案

*   `docs/shop.md` (本文件)
*   `client/src/app/shop/[game_id]/page.tsx` (遊戲儲值頁)
*   `client/src/components/shop/GameCard.tsx` (商店主頁的遊戲卡片組件)
*   `client/src/components/shop/OrderForm.tsx` (遊戲儲值頁的下單表單)

## 4. 資料庫 Schema (建議)

請確保您的 Supabase 資料庫有類似以下的資料表結構：

**games**

| 欄位 | 類型 | 描述 |
| :--- | :--- | :--- |
| id | uuid | Primary Key |
| name | text | 遊戲名稱 |
| description | text | 遊戲描述 |
| image_url | text | 遊戲圖片 URL |
| is_active | boolean | 是否上架，用於控制商店可見性 |
| created_at | timestampz | |

**game_packages**

| 欄位 | 類型 | 描述 |
| :--- | :--- | :--- |
| id | uuid | Primary Key |
| game_id | uuid | Foreign Key to `games.id` |
| name | text | 儲值選項名稱 (例如 "1000 鑽石") |
| price | numeric | 價格 |
| created_at | timestampz | |

