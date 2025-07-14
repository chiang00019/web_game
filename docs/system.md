# 系統架構與功能介紹

## 總覽

本專案是一個基於 Next.js、TypeScript 和 Supabase 的遊戲儲值網站。採用 Serverless 架構，前端負責渲染與使用者互動，後端邏輯則透過 Next.js API Routes 和 Supabase 服務實現。

## 檔案架構

```
client/
└───src/
    ├───app/
    │   ├───admin/             -- 管理員後台
    │   │   ├───games/         -- 遊戲管理
    │   │   ├───orders/        -- 訂單管理
    │   │   └───payments/      -- 支付方式管理
    │   ├───api/               -- 後端 API 路由
    │   │   ├───auth/          -- 驗證 API
    │   │   ├───games/         -- 遊戲 API
    │   │   ├───orders/        -- 訂單 API
    │   │   └───payments/      -- 支付方式 API
    │   ├───auth/              -- 驗證頁面 (登入/註冊)
    │   └───shop/              -- 商店頁面
    │       └───[game_id]/     -- 特定遊戲的訂單頁面
    ├───components/
    │   ├───admin/             -- 管理員專用組件
    │   ├───auth/              -- 驗證表單組件
    │   └───shop/              -- 商店頁面組件
    ├───hooks/                 -- 自定義 Hooks
    ├───lib/                   -- 共用函式庫 (Supabase 客戶端)
    ├───utils/                 -- 工具函式 (Supabase 中介軟體)
    └───types/                 -- TypeScript 類型定義
```

## 主要功能介紹

### 1. 驗證 (Authentication)
*   **描述:** 處理使用者註冊、登入、登出、密碼重設等功能。透過 Supabase Auth 實現，並利用 `is_admin` 表來區分一般使用者和管理員。
*   **主要檔案:**
    *   `app/auth/page.tsx`: 登入/註冊頁面。
    *   `app/api/auth/**`: 處理驗證邏輯的 API。
    *   `components/auth/AuthForm.tsx`: 驗證表單組件。
    *   `utils/supabase/`: Supabase 客戶端和中介軟體設定。
    *   `docs/auth.md`: 驗證功能的詳細建議文件。

### 2. 商店 (Shop)
*   **描述:** 使用者可以瀏覽所有上架的遊戲，並點擊進入特定遊戲的儲值頁面。
*   **主要檔案:**
    *   `app/shop/page.tsx`: 顯示所有遊戲的商店主頁。
    *   `app/shop/[game_id]/page.tsx`: 特定遊戲的下單頁面。
    *   `components/shop/GameCard.tsx`: 遊戲卡片組件。
    *   `components/shop/OrderForm.tsx`: 訂單填寫表單。

### 3. 遊戲管理 (Game Management)
*   **描述:** (僅限管理員) 新增、編輯和管理網站上顯示的遊戲。
*   **主要檔案:**
    *   `app/admin/games/page.tsx`: 遊戲管理頁面。
    *   `app/api/games/route.ts`: 處理遊戲資料庫操作的 API。
    *   `components/admin/GameForm.tsx`: 新增/編輯遊戲的表單。

### 4. 訂單管理 (Order Management)
*   **描述:** (僅限管理員) 查看和管理所有使用者的訂單。
*   **主要檔案:**
    *   `app/admin/orders/page.tsx`: 訂單管理頁面。
    *   `app/api/orders/route.ts`: 處理訂單資料庫操作的 API。
    *   `components/admin/OrderList.tsx`: 顯示訂單列表的組件。

### 5. 核心邏輯與類型 (Core Logic & Types)
*   **描述:** 存放整個專案共用的程式碼，包括自定義 Hooks、Supabase 客戶端設定和 TypeScript 類型定義。
*   **主要檔案:**
    *   `hooks/`: 封裝資料獲取和狀態管理邏輯。
    *   `lib/`: 封裝 Supabase 的資料庫操作。
    *   `types/database.ts`: 全域 TypeScript 類型定義。
