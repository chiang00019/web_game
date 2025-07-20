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

#### 2.1. 模板化儲值頁面 (Templated Top-up Interface)
*   **描述:** 為所有遊戲提供統一的儲值頁面模板，確保一致的用戶體驗。每個遊戲只需配置特定的選項參數，系統會自動渲染相應的表單欄位。
*   **特色功能:**
    *   動態表單欄位生成 (文字輸入、下拉選單、單選按鈕等)
    *   智能表單驗證和草稿儲存功能
    *   管理員可視化配置介面
    *   即時預覽配置效果
*   **主要檔案:**
    *   `components/shop/GameTopupTemplate.tsx`: 通用儲值頁面模板。
    *   `components/shop/DynamicGameOptions.tsx`: 動態選項渲染組件。
    *   `app/api/games/[id]/config/route.ts`: 遊戲配置 API。
    *   `app/admin/games/[id]/config/page.tsx`: 遊戲配置管理頁面。
    *   `components/admin/GameConfigForm.tsx`: 配置表單組件。

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

#### 3.5. 遊戲模板配置管理 (Game Template Configuration Management)
*   **描述:** (僅限管理員) 管理每個遊戲的模板配置選項，包括表單欄位類型、驗證規則、顯示順序和視覺主題等。
*   **主要檔案:**
    *   `app/admin/games/[id]/config/page.tsx`: 遊戲配置管理頁面。
    *   `app/api/games/[id]/config/route.ts`: 遊戲配置 CRUD API。
    *   `components/admin/TemplatePreview.tsx`: 模板預覽組件。

#### 3.6. 報表與分析 (Reporting & Analytics)
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
    *   `utils/formValidation.ts`: 動態表單驗證工具函式。

---
---

# 系統功能規格書 (System Functional Specification)

## 1. 專案概述

### 1.1. 背景與目標
本專案旨在為「YH工作室」開發一個輕量級的遊戲儲值網站。目標是提供一個直觀的介面，讓使用者可以輕鬆提交儲值訂單，同時也為管理員提供一個高效的後台系統，用以管理遊戲項目和處理訂單。本系統將透過簡化訂單流程與觸發自動化腳本，來提升整體營運效率。

### 1.2. 使用者故事 (User Stories)

- **作為一個遊戲玩家 (一般使用者):**
    - 我想要瀏覽一個清晰的遊戲列表，以便找到我需要儲值的遊戲。
    - 我想要在一個專屬頁面查看遊戲的詳細資訊，並填寫我的角色ID來下訂單。
    - 我想要在提交訂單後，能清楚地知道下一步該如何完成付款。

- **作為一個網站管理員:**
    - 我想要一個受密碼保護的後台，來管理網站的內容。
    - 我想要能夠輕鬆地新增、修改或下架商店中的遊戲。
    - 我想要查看所有使用者的訂單，並能快速篩選出那些等待我確認付款的訂單。
    - 我想要在確認收到使用者的款項後，只需點擊一個按鈕，就能將訂單標記為「已付款」，並自動觸發後續的儲值流程。

### 1.3. 技術規格
- **前端框架:** Next.js (React)
- **程式語言:** TypeScript
- **後端服務:** Supabase (包含 PostgreSQL 資料庫, Auth, Storage)
- **樣式方案:** Tailwind CSS
- **部署平台:** Vercel

---

## 2. 功能詳述

本章節將依據 `SRS.md` 中定義的需求，對每個功能模組的具體流程、操作和規則進行詳細說明。

### 2.1. 驗證模組 (Authentication)

#### 2.1.1. 使用者註冊
- **觸發條件:** 使用者在登入頁面點擊「註冊」選項。
- **流程:**
    1. 系統顯示註冊表單，欄位包含：使用者名稱、電子郵件、密碼、確認密碼。
    2. 使用者填寫完畢後點擊「註冊」。
    3. 前端進行基本驗證（如：欄位不得為空、密碼與確認密碼必須相符）。
    4. 驗證通過後，向後端 API (`/api/auth/signup`) 發送請求。
    5. 後端呼叫 Supabase Auth 進行註冊，並觸發 `on_auth_user_created` 函數，將新使用者資料同步至 `public.profiles` 表。
- **成功結果:** 使用者帳號建立成功，自動登入並導向商店主頁。
- **失敗/例外:**
    - 若電子郵件已被註冊，系統應提示「此電子郵件已被使用」。
    - 若輸入格式錯誤，應提示具體的錯誤訊息。

#### 2.1.2. 使用者登入
- **觸發條件:** 使用者在登入頁面填寫資料後點擊「登入」。
- **流程:**
    1. 系統顯示登入表單，欄位包含：電子郵件、密碼。
    2. 使用者填寫完畢後點擊「登入」。
    3. 向後端 API (`/api/auth/login`) 發送請求。
    4. 後端呼叫 Supabase Auth 驗證使用者憑證。
- **成功結果:** 使用者成功登入。若使用者為管理員 (`is_admin = true`)，導覽列會顯示「管理後台」連結；若為一般使用者，則導向商店主頁。
- **失敗/例外:**
    - 若帳號或密碼錯誤，系統應提示「電子郵件或密碼不正確」。

### 2.2. 商店模組 (Shop)

#### 2.2.1. 瀏覽遊戲列表
- **對應需求:** `REQ-FUN-001`
- **流程:**
    1. 使用者進入 `/shop` 頁面。
    2. 系統從 `public.game` 資料表讀取所有 `is_active = true` 的遊戲資料。
    3. 遊戲以卡片形式陳列，每張卡片顯示遊戲圖片、名稱和價格區間。

#### 2.2.2. 提交訂單
- **對應需求:** `REQ-FUN-002` to `REQ-FUN-008`
- **流程:**
    1. 使用者點擊某個遊戲卡片，進入 `/shop/[game_id]` 頁面。
    2. 系統檢查使用者登入狀態，若未登入，則顯示登入提示或彈出登入視窗。
    3. 登入後，頁面顯示該遊戲的詳細資訊以及訂單表單。
    4. 使用者在表單中填寫「遊戲角色ID」等必要資訊，並選擇一個儲值包。
    5. 使用者點擊「提交訂單」。
    6. 系統向後端 API (`/api/orders`) 發送 `POST` 請求，請求內容包含 `user_id`, `game_id`, `package_id`, `character_id` 等。
    7. API 驗證資料無誤後，在 `public.order` 資料表中插入一筆新紀錄，`status` 欄位預設為 `pending`。
    8. 前端收到成功回應後，顯示「訂單已成功提交！」訊息。

### 2.3. 管理後台模組 (Admin Panel)

#### 2.3.1. 權限控制
- **對應需求:** `REQ-NFN-001`
- **流程:**
    1. 所有 `/admin/**` 路徑的頁面和 `/api/admin/**` 的 API 路由，都必須經過權限中介軟體驗證。
    2. 中介軟體會檢查當前 session 的使用者 `user_id`，並在 `public.profiles` 表中查詢其 `is_admin` 欄位。
    3. 若 `is_admin` 不為 `true`，則拒絕存取，將使用者導向首頁或回傳 403 Forbidden 錯誤。

#### 2.3.2. 訂單管理
- **對應需求:** `REQ-FUN-011` to `REQ-FUN-014`
- **流程:**
    1. 管理員進入 `/admin/orders` 頁面。
    2. 系統預設顯示所有 `status = 'pending'` 的訂單，並提供篩選器可查看所有訂單或已完成訂單。
    3. 每筆訂單以表格形式呈現，包含訂單號、使用者名稱、遊戲、金額、角色ID、下單時間等資訊。
    4. 對於每筆 `pending` 的訂單，旁邊有一個「確認收款」按鈕。
    5. 管理員點擊「確認收款」按鈕。
    6. 系統向後端 API (`/api/orders/[order_id]`) 發送 `PUT` 請求，將 `status` 更新為 `paid`。
    7. **Hook 觸發:** 在 API 成功更新資料庫後，觸發對應的儲值腳本掛鉤，並傳入必要的訂單參數。
    8. 前端即時更新該筆訂單的顯示狀態。

#### 2.3.3. 遊戲管理
- **對應需求:** `REQ-FUN-015`, `REQ-FUN-016`
- **流程:**
    1. 管理員進入 `/admin/games` 頁面。
    2. 頁面顯示所有遊戲的列表，並提供「新增遊戲」按鈕。
    3. **新增:** 點擊「新增遊戲」，彈出表單，填寫遊戲名稱、描述、圖片URL等資訊後儲存。
    4. **編輯:** 點擊既有遊戲旁的「編輯」按鈕，在表單中修改資訊後儲存。
    5. **刪除/停用:** 點擊「刪除」或「停用」按鈕，將遊戲從商店頁面隱藏（建議使用軟刪除，如設定 `is_active = false`）。

---

## 3. API 規格

*(此處為簡化版，實際開發應更詳細)*

| 功能 | 路徑 | 方法 | 參數/Body | 回應 | 說明 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 使用者註冊 | `/api/auth/signup` | `POST` | `{ email, password, username }` | `{ user, session }` | 建立新使用者 |
| 使用者登入 | `/api/auth/login` | `POST` | `{ email, password }` | `{ user, session }` | 驗證使用者並建立 session |
| 建立訂單 | `/api/orders` | `POST` | `{ game_id, package_id, character_id }` | `{ order_id, status }` | 登入使用者建立新訂單 |
| 更新訂單狀態 | `/api/orders/[id]` | `PUT` | `{ status: 'paid' }` | `{ success: true }` | (管理員) 更新訂單狀態 |
| 取得所有遊戲 | `/api/games` | `GET` | - | `[Game]` | 取得所有公開遊戲 |
| 新增遊戲 | `/api/games` | `POST` | `{ name, description, ... }` | `{ game_id }` | (管理員) 新增遊戲 |

---

## 4. 資料庫設計 (Schema)

*(此處為簡化版，詳細請參考 `db.md`)*

- **`profiles`**: `user_id (pk)`, `username`, `is_admin (boolean)`
- **`game`**: `id (pk)`, `name`, `description`, `image_url`, `is_active (boolean)`
- **`game_packages`**: `id (pk)`, `game_id (fk)`, `name`, `price`
- **`order`**: `id (pk)`, `user_id (fk)`, `package_id (fk)`, `character_id`, `status (enum: pending, paid)`, `created_at`

---

## 5. 開發時程 (Development Timeline)

| 階段 | 主要任務 | 預計完成日期 | 狀態 |
| :--- | :--- | :--- | :--- |
| Phase 0 | 專案初始化與資料庫設定 | - | ✅ 已完成 |
| Phase 1 | 使用者驗證系統 | - | ✅ 已完成 |
| Phase 2 | 商店與遊戲列表 | - | ✅ 已完成 |
| Phase 3 | 管理員後台基礎建設 | - | ✅ 已完成 |
| Phase 4 | 管理員後台核心功能 | - | ✅ 已完成 |
| Phase 5 | 下訂單功能 | - | ✅ 已完成 |
| Phase 6 | 模板化遊戲儲值頁面 | TBD | 🔄 進行中 |
| Phase 7 | 報表與分析 | TBD | ⏳ 待開始 |
| Phase 8 | 儲值觸發 (Hook) 與自動化 | TBD | ⏳ 待開始 |

---
---

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

## Phase 6: 模板化遊戲儲值頁面 (Templated Game Top-up Interface)

**目標:** 建立統一的遊戲儲值頁面模板，提供一致的用戶體驗，每個遊戲只需配置特定的選項即可。

### 6.1. 資料庫架構擴展

1.  **遊戲配置表 (Game Configuration):**
    *   建立 `game_config` 表來儲存每個遊戲的特定配置選項。
    *   欄位包含：`id (pk)`, `game_id (fk)`, `field_type`, `field_key`, `field_label`, `field_options`, `display_order`, `is_required`, `created_at`
    *   支援的 field_type：`text`, `select`, `radio`, `checkbox`, `number`
    *   例如：伺服器選項、角色 ID、遊戲區域等特定選項。

### 6.2. 通用儲值頁面模板

1.  **重構現有的遊戲頁面:**
    *   將 `app/shop/[game_id]/page.tsx` 改為使用新的模板系統。
    *   保留現有的遊戲詳細資訊展示，但將訂單表單部分模板化。

2.  **建立模板組件:**
    *   在 `components/shop/` 中建立 `GameTopupTemplate.tsx`，作為所有遊戲儲值頁面的通用模板。
    *   模板包含以下區塊：
        *   遊戲基本資訊區塊 (名稱、描述、圖片)
        *   動態配置選項區塊 (根據 `game_config` 渲染)
        *   套餐選擇區塊 (沿用現有的套餐系統)
        *   付款方式選擇區塊 (沿用現有的付款系統)
        *   訂單摘要區塊
        *   提交按鈕區塊

3.  **動態選項渲染器:**
    *   建立 `components/shop/DynamicGameOptions.tsx` 組件，根據遊戲配置動態渲染不同類型的輸入欄位：
        *   `text`: 文字輸入 (角色名稱、角色 ID)
        *   `select`: 下拉選單 (伺服器、區域)
        *   `radio`: 單選按鈕 (角色職業、陣營)
        *   `checkbox`: 複選框 (額外服務選項)
        *   `number`: 數字輸入 (角色等級)

### 6.3. API 端點擴展

1.  **遊戲配置 API:**
    *   在 `app/api/games/[id]/config/route.ts` 中建立端點：
        *   `GET`: 取得特定遊戲的所有配置選項
        *   `POST` (管理員): 新增遊戲配置選項
        *   `PUT` (管理員): 更新遊戲配置選項
        *   `DELETE` (管理員): 刪除遊戲配置選項

2.  **更新訂單 API:**
    *   修改 `app/api/orders/route.ts` 的 `POST` 方法，支援動態欄位的儲存。
    *   在 `order` 表中使用 `game_data` JSONB 欄位儲存動態表單資料。

### 6.4. 管理員後台擴展

1.  **遊戲配置管理介面:**
    *   在 `app/admin/games/[id]/config/page.tsx` 中建立遊戲特定的配置管理頁面。
    *   提供簡潔的表單介面來新增、編輯、刪除各種配置選項。
    *   支援拖拉排序來調整選項顯示順序。

2.  **配置表單組件:**
    *   建立 `components/admin/GameConfigForm.tsx` 組件，用於編輯單一配置選項。
    *   建立 `components/admin/ConfigFieldPreview.tsx` 組件，即時預覽設定效果。

### 6.5. 用戶體驗優化

1.  **智能表單驗證:**
    *   根據遊戲配置的 `is_required` 欄位動態產生表單驗證規則。
    *   提供即時的欄位驗證回饋。

2.  **儲存草稿功能:**
    *   在使用者填寫表單過程中自動儲存草稿到 localStorage。
    *   頁面重新載入時自動恢復填寫進度。

### 6.6. 實作步驟

1.  **第一階段 - 基礎架構 (不包含資料庫):**
    *   建立基本的模板組件架構
    *   實現動態選項渲染器
    *   將現有遊戲頁面改為使用模板系統

2.  **第二階段 - 管理介面:**
    *   建立遊戲配置管理頁面
    *   實現配置 CRUD 操作 (先用 mock 資料)
    *   加入即時預覽功能

3.  **第三階段 - 用戶體驗優化:**
    *   加入表單驗證和草稿儲存功能
    *   進行跨瀏覽器相容性測試
    *   優化響應式設計

---

## Phase 7: 報表與分析

**目標:** 為管理員提供業務洞察。

1.  **建立報表 API:**
    *   在 `app/api/reports/top-customers/route.ts` 中建立 `GET` 端點，根據篩選條件查詢並回傳高價值客戶數據。
2.  **建立報表 UI:**
    *   在 `app/admin/reports/page.tsx` 中，建立互動式篩選器 (日期、遊戲)。
    *   使用圖表庫 (如 Recharts) 將後端數據視覺化，並在下方顯示詳細的資料表格。

---

## Phase 8: 實現儲值觸發 (Hook)

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