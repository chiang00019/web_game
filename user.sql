-- 測試用戶數據和基礎數據
-- 注意：由於 Supabase Auth 的限制，用戶帳號需要通過註冊流程創建
-- 這個文件僅包含 public schema 的測試數據

-- ========= 基礎測試數據 =========

-- 插入付款方式測試數據
INSERT INTO public.payment_method (method) VALUES 
  ('信用卡'),
  ('超商付款'),
  ('ATM轉帳'),
  ('LINE Pay'),
  ('街口支付')
ON CONFLICT DO NOTHING;

-- 插入測試遊戲
INSERT INTO public.game (game_name, category, icon, is_active) VALUES 
  ('原神', 'RPG', 'https://via.placeholder.com/64x64/4F46E5/FFFFFF?text=原神', true),
  ('英雄聯盟', 'MOBA', 'https://via.placeholder.com/64x64/059669/FFFFFF?text=LOL', true),
  ('楓之谷', 'MMORPG', 'https://via.placeholder.com/64x64/DC2626/FFFFFF?text=楓谷', true),
  ('PUBG', 'Battle Royale', 'https://via.placeholder.com/64x64/F59E0B/FFFFFF?text=PUBG', true),
  ('傳說對決', 'MOBA', 'https://via.placeholder.com/64x64/8B5CF6/FFFFFF?text=AOV', false)
ON CONFLICT DO NOTHING;

-- 插入遊戲包裝測試數據（需要先有遊戲）
INSERT INTO public.game_packages (game_id, name, description, price, is_active) VALUES 
  (1, '60 創世結晶', '原神官方貨幣，可用於抽卡和購買道具', 30.00, true),
  (1, '300 創世結晶', '原神官方貨幣，可用於抽卡和購買道具', 150.00, true),
  (1, '980 創世結晶', '原神官方貨幣，可用於抽卡和購買道具', 490.00, true),
  (2, '650 聯盟幣', '英雄聯盟遊戲幣，可購買英雄和造型', 200.00, true),
  (2, '1380 聯盟幣', '英雄聯盟遊戲幣，可購買英雄和造型', 400.00, true),
  (3, '1000 楓幣', '楓之谷遊戲幣，可購買道具和時裝', 100.00, true),
  (3, '5000 楓幣', '楓之谷遊戲幣，可購買道具和時裝', 450.00, true),
  (4, '600 UC', 'PUBG 遊戲幣，可購買造型和道具', 180.00, true),
  (4, '1500 UC', 'PUBG 遊戲幣，可購買造型和道具', 450.00, true)
ON CONFLICT DO NOTHING;

-- 設定遊戲允許的付款方式（所有遊戲都允許所有付款方式）
INSERT INTO public.allow_payment_method (game_id, payment_method_id) 
SELECT g.game_id, p.payment_method_id 
FROM public.game g 
CROSS JOIN public.payment_method p
ON CONFLICT DO NOTHING;

-- 插入測試橫幅
INSERT INTO public.banner (title, content, image_url, link_url, is_active) VALUES 
  (
    '🎮 歡迎來到遊戲商店！',
    '最新最熱門的遊戲點數，限時優惠中！快來選購您喜愛的遊戲點數！',
    'https://via.placeholder.com/800x200/4F46E5/FFFFFF?text=歡迎來到遊戲商店',
    '/shop',
    true
  ),
  (
    '🎁 新用戶專屬優惠',
    '首次購買享受9折優惠，立即體驗各種熱門遊戲！現在註冊就送50元購物金！',
    'https://via.placeholder.com/800x200/059669/FFFFFF?text=新用戶9折優惠',
    '/shop',
    true
  ),
  (
    '⚠️ 系統維護公告',
    '系統將於本週日凌晨2:00-4:00進行例行維護，維護期間暫停服務，造成不便敬請見諒。',
    'https://via.placeholder.com/800x200/DC2626/FFFFFF?text=維護公告',
    null,
    false
  ),
  (
    '🔥 熱門遊戲推薦',
    '原神、英雄聯盟最新活動開跑！限時加贈遊戲道具，數量有限先搶先贏！',
    'https://via.placeholder.com/800x200/F59E0B/FFFFFF?text=熱門遊戲推薦',
    '/shop',
    true
  )
ON CONFLICT DO NOTHING;

-- 插入測試的自動化腳本（示例）
INSERT INTO public.add_value_process (script) VALUES 
  ('#!/bin/bash\n# 原神充值腳本\necho "Processing Genshin Impact recharge for UID: $1"'),
  ('#!/bin/bash\n# 英雄聯盟充值腳本\necho "Processing League of Legends recharge for Account: $1"'),
  ('#!/bin/bash\n# 楓之谷充值腳本\necho "Processing MapleStory recharge for Character: $1"')
ON CONFLICT DO NOTHING;

-- 設定遊戲使用的充值腳本
INSERT INTO public.use (game_id, process_id) VALUES 
  (1, 1), -- 原神使用腳本1
  (2, 2), -- 英雄聯盟使用腳本2
  (3, 3)  -- 楓之谷使用腳本3
ON CONFLICT DO NOTHING;

-- ========= 帳號創建指導 =========

-- 由於 Supabase Auth 的限制，請按照以下步驟創建測試帳號：

-- 步驟 1: 手動註冊帳號
-- 請使用您的應用程式註冊以下帳號：
-- 管理員: admin@webgame.com (密碼: admin123)
-- 用戶:   user@webgame.com  (密碼: user123)

-- 步驟 2: 設定管理員權限
-- 註冊完成後，執行以下 SQL 來設定管理員權限：

/*
UPDATE public.profiles 
SET is_admin = true,
    user_name = '系統管理員',
    line_username = 'admin_line',
    phone_no = '0912345678'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = ''
);

UPDATE public.profiles 
SET user_name = '測試用戶',
    line_username = 'testuser_line', 
    phone_no = '0987654321'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'user@webgame.com'
);
*/

-- ========= 數據驗證查詢 =========

-- 檢查插入的基礎數據
SELECT '=== 付款方式 ===' as section;
SELECT payment_method_id, method FROM public.payment_method ORDER BY payment_method_id;

SELECT '=== 遊戲列表 ===' as section;
SELECT game_id, game_name, category, is_active FROM public.game ORDER BY game_id;

SELECT '=== 遊戲包裝 ===' as section;
SELECT 
  gp.package_id,
  g.game_name,
  gp.name,
  gp.price,
  gp.is_active
FROM public.game_packages gp
JOIN public.game g ON gp.game_id = g.game_id
ORDER BY gp.game_id, gp.package_id;

SELECT '=== 橫幅 ===' as section;
SELECT banner_id, title, is_active FROM public.banner ORDER BY banner_id;

SELECT '=== 遊戲付款方式 ===' as section;
SELECT 
  g.game_name,
  pm.method
FROM public.allow_payment_method apm
JOIN public.game g ON apm.game_id = g.game_id
JOIN public.payment_method pm ON apm.payment_method_id = pm.payment_method_id
ORDER BY g.game_name, pm.method;

-- ========= 測試帳號資訊 =========
SELECT 
  '📋 測試帳號資訊' as info,
  '請手動註冊以下帳號：' as instruction;

SELECT 
  'admin@webgame.com' as email,
  'admin123' as password,
  '系統管理員' as user_name,
  '管理員帳號 - 可存取所有管理功能' as description
UNION ALL
SELECT 
  'user@webgame.com' as email,
  'user123' as password,  
  '測試用戶' as user_name,
  '普通用戶 - 可瀏覽商店和下訂單' as description;

-- ========= 使用提醒 =========
/*
🔧 使用步驟：
1. 先執行 db.sql 建立資料庫結構
2. 執行此 user.sql 插入測試資料
3. 手動註冊測試帳號
4. 執行上方的 UPDATE 語句設定管理員權限
5. 開始測試系統功能

📝 測試功能清單：
- 普通用戶：商店瀏覽、下訂單、查看個人訂單
- 管理員：遊戲管理、訂單管理、橫幅管理、付款方式管理

⚠️  注意事項：
- 這是開發測試用的數據，請勿用於生產環境
- 實際密碼應該更複雜且安全
- 建議定期更換測試帳號密碼
*/ 