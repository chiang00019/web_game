# 系統架構與功能介紹

## 總覽

本專案是一個基於 Next.js、TypeScript 和 Supabase 的遊戲儲值網站。採用 Serverless 架構，前端負責渲染與使用者互動，後端邏輯則透過 Next.js API Routes 和 Supabase 服務實現。

### 技術棧 (Technical Stack)

- **框架 (Framework):** [Next.js](https://nextjs.org/)
- **語言 (Language):** [TypeScript](https://www.typescriptlang.org/)
- **後端 & 資料庫 (Backend & Database):** [Supabase](https://supabase.com/)
- **樣式 (Styling):** [Tailwind CSS](https://tailwindcss.com/)
- **部署 (Deployment):** [Vercel](https://vercel.com/)
- **設計 (Design):** 響應式網站設計 (RWD)，確保在桌面和行動裝置上都有一致的使用體驗。

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
*   **描述:** 處理使用者註冊、登入、登出、**密碼重設**、**電子郵件驗證**與**第三方登入 (OAuth)** 等功能。透過 Supabase Auth 實現，並利用 `public.profiles` 表中的 `is_admin` 欄位來區分一般使用者和管理員。
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

### 3. 管理員後台 (Admin Panel)

#### 3.1. 遊戲管理 (Game Management)
*   **描述:** (僅限管理員) 新增、編輯和管理網站上顯示的遊戲。
*   **主要檔案:**
    *   `app/admin/games/page.tsx`: 遊戲管理頁面。
    *   `app/api/games/route.ts`: 處理遊戲資料庫操作的 API。
    *   `components/admin/GameForm.tsx`: 新增/編輯遊戲的表單。

#### 3.2. 訂單管理 (Order Management)
*   **描述:** (僅限管理員) 查看和管理所有使用者的訂單。
    *   訂單狀態 (`status`) 分為 `pending` (待付款) 與 `paid` (已付款)。
    *   管理員在確認使用者線下付款後，於後台手動將訂單狀態從 `pending` 更新為 `paid`。
    *   訂單狀態轉為 `paid` 時，會觸發一個 hook，為後續執行自動化儲值腳本做準備。
*   **主要檔案:**
    *   `app/admin/orders/page.tsx`: 訂單管理頁面。
    *   `app/api/orders/route.ts`: 處理訂單資料庫操作的 API。
    *   `components/admin/OrderList.tsx`: 顯示訂單列表的組件。

#### 3.3. 橫幅管理 (Banner Management)
*   **描述:** (僅限管理員) 新增、刪除、啟用/停用顯示於網站首頁的橫幅廣告。
*   **主要檔案:**
    *   `app/admin/banners/page.tsx`: 橫幅管理頁面。
    *   `app/api/banners/route.ts`: 處理橫幅資料庫操作的 API。

#### 3.4. 付款方式管理 (Payment Method Management)
*   **描述:** (僅限管理員) 管理網站支援的付款方式，並可設定不同遊戲適用的付款選項。
*   **主要檔案:**
    *   `app/admin/payments/page.tsx`: 付款方式管理頁面。
    *   `app/api/payments/route.ts`: 處理付款方式資料庫操作的 API。

#### 3.5. 報表與分析 (Reporting & Analytics)
*   **描述:** (僅限管理員) 提供業務洞察，例如高價值客戶分析，並以視覺化圖表與資料表格呈現。
*   **主要檔案:**
    *   `app/admin/reports/page.tsx`: 報表分析頁面。
    *   `app/api/reports/top-customers/route.ts`: 提供高價值客戶數據的 API。

### 4. 核心邏輯與類型 (Core Logic & Types)
*   **描述:** 存放整個專案共用的程式碼，包括自定義 Hooks、Supabase 客戶端設定和 TypeScript 類型定義。
*   **主要檔案:**
    *   `hooks/`: 封裝資料獲取和狀態管理邏輯。
    *   `lib/`: 封裝 Supabase 的資料庫操作。
    *   `types/database.ts`: 全域 TypeScript 類型定義。
