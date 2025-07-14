# 開發實作 SOP (Standard Operating Procedure)

這份 SOP 將根據 `db.sql` 結構，規劃出一個清晰、可執行的開發流程。

### 專案結構規劃

```
client/
└───src/
    ├───app/
    │   ├───admin/
    │   │   ├───games/         -- (New) 遊戲管理頁面
    │   │   │   └───page.tsx
    │   │   ├───orders/        -- (New) 訂單管理頁面
    │   │   │   └───page.tsx
    │   │   └───payments/      -- (New) 支付方式管理頁面
    │   │       └───page.tsx
    │   ├───api/
    │   │   ├───games/         -- (New) 遊戲 API
    │   │   │   └───route.ts
    │   │   ├───orders/        -- (New) 訂單 API
    │   │   │   └───route.ts
    │   │   └───payments/      -- (New) 支付方式 API
    │   │       └───route.ts
    │   └───shop/              -- 使用者商店頁面
    │   │   └───[game_id]/     -- (New) 特定遊戲的訂單頁面
    │   │       └───page.tsx
    ├───components/
    │   ├───admin/             -- (New) 管理員專用組件
    │   │   ├───GameForm.tsx
    │   │   ├───OrderList.tsx
    │   │   └───PaymentForm.tsx
    │   └───shop/              -- (New) 商店頁面組件
    │       ├───GameCard.tsx
    │       └───OrderForm.tsx
    ├───hooks/                 -- (New) 自定義 Hooks (用於數據獲取、狀態管理)
    │   ├───useAdmin.ts
    │   ├───useGames.ts
    │   └───useOrders.ts
    ├───lib/                   -- (New) 共用函式庫 (Supabase 操作)
    │   ├───supabaseAdmin.ts   -- (New) 需要 admin 權限的 Supabase 操作
    │   └───supabaseClient.ts  -- (New) 公開的 Supabase 操作
    └───types/                 -- (New) TypeScript 類型定義
        └───database.ts
```

### 步驟 1: 定義 TypeScript 類型

**目標:** 根據 `db.sql` 建立全專案共用的 TypeScript 類型，確保資料型別的一致性。

1.  **建立檔案:** `client/src/types/database.ts`
2.  **內容:** 根據 `db.sql` 的資料表結構，定義 `Game`, `Order`, `PaymentMethod`, `Profile` 等介面。

    ```typescript
    // client/src/types/database.ts

    export interface Profile {
      user_id: string;
      is_admin: boolean;
      user_name?: string;
    }

    export interface Game {
      game_id: number;
      game_name: string;
      category?: string;
      icon?: string;
      is_active: boolean;
    }

    export interface PaymentMethod {
      payment_method_id: number;
      method: string;
    }

    export interface Order {
      order_id: number;
      user_id?: string;
      game_id: number;
      payment_method_id: number;
      amount: number;
      line_username?: string;
      phone_no?: string;
      is_adv: boolean;
      game_uid?: string;
      game_server?: string;
      game_username?: string;
      note?: string;
      game?: Game;
      payment_method?: PaymentMethod;
    }
    ```

### 步驟 2: 建立後端 API 路由

**目標:** 建立處理資料庫操作的 API 端點，並加入權限控制。

1.  **遊戲 API (`/api/games`)**
    *   **檔案:** `client/src/app/api/games/route.ts`
    *   **功能:**
        *   `GET`: 獲取所有 `is_active` 的遊戲列表（公開）。
        *   `POST`: 新增遊戲（僅限管理員）。

2.  **訂單 API (`/api/orders`)**
    *   **檔案:** `client/src/app/api/orders/route.ts`
    *   **功能:**
        *   `GET`: 獲取所有訂單列表（僅限管理員），或獲取當前使用者的訂單歷史（登入使用者）。
        *   `POST`: 建立一筆新訂單（登入使用者）。

3.  **支付方式 API (`/api/payments`)**
    *   **檔案:** `client/src/app/api/payments/route.ts`
    *   **功能:**
        *   `GET`: 獲取所有支付方式（公開）。
        *   `POST`: 新增支付方式（僅限管理員）。

### 步驟 3: 建立自定義 Hooks

**目標:** 封裝客戶端的資料獲取邏輯，讓 UI 組件更簡潔。

1.  **`useGames.ts`**
    *   **檔案:** `client/src/hooks/useGames.ts`
    *   **功能:** 提供一個 `useGames` hook，從 `/api/games` 獲取遊戲列表。

2.  **`useOrders.ts`**
    *   **檔案:** `client/src/hooks/useOrders.ts`
    *   **功能:** 提供 `useOrders` hook，從 `/api/orders` 獲取訂單資料。

3.  **`useAdmin.ts`**
    *   **檔案:** `client/src/hooks/useAdmin.ts`
    *   **功能:** 提供 `useAdmin` hook，檢查當前使用者是否為管理員。

### 步驟 4: 開發 UI 組件

**目標:** 建立可重複使用的 UI 組件。

1.  **商店組件 (`/components/shop`)**
    *   `GameCard.tsx`: 顯示單一遊戲資訊的卡片。
    *   `OrderForm.tsx`: 讓使用者填寫訂單資訊的表單。

2.  **管理員組件 (`/components/admin`)**
    *   `GameForm.tsx`: 新增或編輯遊戲的表單。
    *   `OrderList.tsx`: 顯示所有訂單的列表。
    *   `PaymentForm.tsx`: 新增或編輯支付方式的表單。

### 步驟 5: 組合頁面

**目標:** 將組件和 Hooks 整合到 Next.js 的頁面中。

1.  **商店頁面 (`/app/shop/page.tsx`)**
2.  **下單頁面 (`/app/shop/[game_id]/page.tsx`)**
3.  **管理員 - 遊戲管理 (`/app/admin/games/page.tsx`)**
4.  **管理員 - 訂單管理 (`/app/admin/orders/page.tsx`)**
