-- This script can be executed repeatedly to reset the database schema.
-- It first drops all tables in the correct order and then recreates them.

-- ========= DROP DEPENDENCIES (in correct order) =========
-- 1. Drop triggers first (they depend on functions and tables)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_order_updated ON public."order";
DROP TRIGGER IF EXISTS on_games_updated ON public.games;
DROP TRIGGER IF EXISTS on_game_options_updated ON public.game_options;

-- 2. Drop functions that might be used by other functions or policies
DROP FUNCTION IF EXISTS public.get_top_customers(integer, text, text);
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;

-- 3. Drop policies that depend on functions.
DROP POLICY IF EXISTS "Admins can access all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can access all orders" ON public."order";
DROP POLICY IF EXISTS "Admins can manage games" ON public.games;
DROP POLICY IF EXISTS "Admins can manage game packages" ON public.game_options;
DROP POLICY IF EXISTS "Admins can manage payment methods" ON public.payment_method;
DROP POLICY IF EXISTS "Admins can manage banners" ON public.banner;
DROP POLICY IF EXISTS "Admins can manage tags" ON public.tags;
DROP POLICY IF EXISTS "Admins can manage game_tags" ON public.game_tags;


-- 4. Drop the rest of the functions.
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.is_admin();

-- 5. Drop tables. CASCADE handles foreign key constraints and other dependencies.
DROP TABLE IF EXISTS public."order" CASCADE;
DROP TABLE IF EXISTS public.allow_payment_method CASCADE;
DROP TABLE IF EXISTS public.use CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.game_options CASCADE;
DROP TABLE IF EXISTS public.game_tags CASCADE;
DROP TABLE IF EXISTS public.games CASCADE;
DROP TABLE IF EXISTS public.tags CASCADE;
DROP TABLE IF EXISTS public.payment_method CASCADE;
DROP TABLE IF EXISTS public.add_value_process CASCADE;
DROP TABLE IF EXISTS public.banner CASCADE;

-- 6. Drop custom types, which are used by tables.
DROP TYPE IF EXISTS public.order_status;


-- ========= CREATE TYPES =========
CREATE TYPE public.order_status AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded'
);


-- ========= CREATE TABLES =========
CREATE TABLE public.games (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon_path VARCHAR(255),
  servers TEXT[], -- 儲存伺服器列表的陣列
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.game_options (
    id SERIAL PRIMARY KEY,
    game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    icon_path VARCHAR(255),
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.game_tags (
    game_id INTEGER NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, tag_id)
);

CREATE TABLE public.payment_method (
  payment_method_id SERIAL PRIMARY KEY,
  method text NOT NULL
);

CREATE TABLE public.add_value_process (
  process_id SERIAL PRIMARY KEY,
  script text
);

CREATE TABLE public.banner (
  banner_id SERIAL PRIMARY KEY,
  title text,
  content text,
  image_url text,
  link_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.profiles (
  user_id uuid NOT NULL PRIMARY KEY,
  is_admin boolean DEFAULT false,
  user_name text,
  line_username text,
  phone_no text,
  CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);
COMMENT ON TABLE public.profiles IS 'Stores user profiles and admin status.';

CREATE TABLE public."order" (
  order_id SERIAL PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(user_id),
  game_id integer REFERENCES public.games(id),
  package_id integer REFERENCES public.game_options(id),
  payment_method_id integer REFERENCES public.payment_method(payment_method_id),
  status public.order_status DEFAULT 'pending',
  is_adv boolean DEFAULT false,
  game_uid text,
  game_server text,
  game_username text,
  note text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);

CREATE TABLE public.allow_payment_method (
  game_id integer NOT NULL,
  payment_method_id integer NOT NULL,
  CONSTRAINT allow_payment_method_pkey PRIMARY KEY (game_id, payment_method_id),
  CONSTRAINT allow_payment_method_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id),
  CONSTRAINT allow_payment_method_payment_method_id_fkey FOREIGN KEY (payment_method_id) REFERENCES public.payment_method(payment_method_id)
);

CREATE TABLE public.use (
  game_id integer NOT NULL,
  process_id integer NOT NULL,
  CONSTRAINT use_pkey PRIMARY KEY (game_id, process_id),
  CONSTRAINT use_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id),
  CONSTRAINT use_process_id_fkey FOREIGN KEY (process_id) REFERENCES public.add_value_process(process_id)
);


-- ========= INDEXES FOR PERFORMANCE =========
CREATE INDEX ON public."order" (user_id);
CREATE INDEX ON public."order" (game_id);
CREATE INDEX ON public."order" (status);
CREATE INDEX ON public.profiles (user_name);
CREATE INDEX ON public.game_options (game_id);


-- ========= FUNCTIONS & TRIGGERS =========

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_order_updated BEFORE UPDATE ON public."order" FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER on_games_updated BEFORE UPDATE ON public.games FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
CREATE TRIGGER on_game_options_updated BEFORE UPDATE ON public.game_options FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, user_name)
  VALUES (new.id, new.raw_user_meta_data->>'user_name');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT is_admin FROM public.profiles WHERE user_id = auth.uid();
$$;


-- ========= ROW LEVEL SECURITY (RLS) =========
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_method ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banner ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_tags ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view their own orders" ON public."order" FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders" ON public."order" FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Publicly readable tables" ON public.games FOR SELECT USING (true);
CREATE POLICY "Publicly readable packages" ON public.game_options FOR SELECT USING (true);
CREATE POLICY "Publicly readable payments" ON public.payment_method FOR SELECT USING (true);
CREATE POLICY "Publicly readable banners" ON public.banner FOR SELECT USING (true);
CREATE POLICY "Publicly readable tags" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Publicly readable game_tags" ON public.game_tags FOR SELECT USING (true);

-- Admin policies
CREATE POLICY "Admins can access all profiles" ON public.profiles FOR ALL USING (public.is_admin());
CREATE POLICY "Admins can access all orders" ON public."order" FOR ALL USING (public.is_admin());
CREATE POLICY "Admins can manage games" ON public.games FOR ALL USING (public.is_admin());
CREATE POLICY "Admins can manage game packages" ON public.game_options FOR ALL USING (public.is_admin());
CREATE POLICY "Admins can manage payment methods" ON public.payment_method FOR ALL USING (public.is_admin());
CREATE POLICY "Admins can manage banners" ON public.banner FOR ALL USING (public.is_admin());
CREATE POLICY "Admins can manage tags" ON public.tags FOR ALL USING (public.is_admin());
CREATE POLICY "Admins can manage game_tags" ON public.game_tags FOR ALL USING (public.is_admin());


-- ========= RPC FOR REPORTS =========

CREATE OR REPLACE FUNCTION public.get_top_customers(
    p_game_id integer DEFAULT NULL,
    p_start_date text DEFAULT NULL,
    p_end_date text DEFAULT NULL
)
RETURNS TABLE (
    user_id uuid,
    user_name text,
    total_spending numeric,
    total_orders bigint,
    avg_order_value numeric,
    last_purchase timestamptz
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.user_id,
        p.user_name,
        SUM(pkg.price) AS total_spending,
        COUNT(o.order_id) AS total_orders,
        AVG(pkg.price) AS avg_order_value,
        MAX(o.created_at) AS last_purchase
    FROM
        public."order" AS o
    JOIN
        public.profiles AS p ON o.user_id = p.user_id
    JOIN
        public.game_options AS pkg ON o.package_id = pkg.id
    WHERE
        o.status = 'completed'
        AND (p_game_id IS NULL OR o.game_id = p_game_id)
        AND (p_start_date IS NULL OR o.created_at >= p_start_date::timestamptz)
        AND (p_end_date IS NULL OR o.created_at <= p_end_date::timestamptz)
    GROUP BY
        p.user_id, p.user_name
    ORDER BY
        total_spending DESC;
END;
$$;


-- ========= INITIAL DATA SYNC =========
INSERT INTO public.profiles (user_id, user_name)
SELECT
    id,
    raw_user_meta_data->>'user_name'
FROM
    auth.users
ON CONFLICT (user_id) DO UPDATE SET
    user_name = EXCLUDED.user_name;
