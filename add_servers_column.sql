-- 安全地添加 servers 欄位到 games 表
-- 這個腳本可以在現有數據庫上運行，不會破壞現有數據

DO $$ 
BEGIN
    -- 檢查 servers 欄位是否已存在
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'games' 
        AND column_name = 'servers'
    ) THEN
        -- 添加 servers 欄位
        ALTER TABLE public.games ADD COLUMN servers TEXT[];
        
        -- 為現有的遊戲設置預設伺服器
        UPDATE public.games 
        SET servers = ARRAY['預設伺服器'] 
        WHERE servers IS NULL;
        
        RAISE NOTICE 'Successfully added servers column to games table';
    ELSE
        RAISE NOTICE 'servers column already exists in games table';
    END IF;
END $$;