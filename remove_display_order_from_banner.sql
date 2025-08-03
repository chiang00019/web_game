-- 安全地移除 banner 表的 display_order 欄位
-- 這個腳本可以在現有資料庫上運行

DO $$ 
BEGIN
    -- 檢查 display_order 欄位是否存在
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'banner' 
        AND column_name = 'display_order'
    ) THEN
        -- 移除 display_order 欄位
        ALTER TABLE public.banner DROP COLUMN display_order;
        
        RAISE NOTICE 'Successfully removed display_order column from banner table';
    ELSE
        RAISE NOTICE 'display_order column does not exist in banner table';
    END IF;
END $$;