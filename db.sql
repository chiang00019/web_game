-- This script can be executed repeatedly to reset the database schema.
-- It first drops all tables in the correct order and then recreates them.

-- ========= DROP TABLES =========
-- Drop tables with CASCADE to automatically handle foreign key dependencies.
DROP TABLE IF EXISTS public."order" CASCADE;
DROP TABLE IF EXISTS public.allow_payment_method CASCADE;
DROP TABLE IF EXISTS public.use CASCADE;
DROP TABLE IF EXISTS public.is_admin CASCADE;
DROP TABLE IF EXISTS public.game CASCADE;
DROP TABLE IF EXISTS public.payment_method CASCADE;
DROP TABLE IF EXISTS public.add_value_process CASCADE;


-- ========= CREATE TABLES =========
-- Create tables that do not have foreign key dependencies first.
-- Using SERIAL type to automatically create sequences for auto-incrementing IDs.
CREATE TABLE public.game (
  game_id SERIAL PRIMARY KEY,
  game_name text NOT NULL,
  category text,
  icon text,
  is_active boolean DEFAULT true
);

CREATE TABLE public.payment_method (
  payment_method_id SERIAL PRIMARY KEY,
  method text NOT NULL
);

CREATE TABLE public.add_value_process (
  process_id SERIAL PRIMARY KEY,
  script text
);

-- Create the is_admin table, linked to Supabase Auth.
CREATE TABLE public.is_admin (
  user_id uuid NOT NULL PRIMARY KEY,
  is_admin boolean DEFAULT false,
  CONSTRAINT "is_admin_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);
COMMENT ON TABLE public.is_admin IS 'Stores user admin status.';

-- Create tables that have foreign key dependencies.
CREATE TABLE public.order (
  order_id SERIAL PRIMARY KEY,
  user_id uuid, -- IMPORTANT: Matches the is_admin table's uuid type.
  game_id integer,
  payment_method_id integer,
  amount numeric,
  line_username text,
  phone_no text,
  is_adv boolean DEFAULT false,
  game_uid text,
  game_server text,
  game_username text,
  note text,
  CONSTRAINT order_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.is_admin(user_id),
  CONSTRAINT order_payment_method_id_fkey FOREIGN KEY (payment_method_id) REFERENCES public.payment_method(payment_method_id),
  CONSTRAINT order_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.game(game_id)
);

CREATE TABLE public.allow_payment_method (
  game_id integer NOT NULL,
  payment_method_id integer NOT NULL,
  CONSTRAINT allow_payment_method_pkey PRIMARY KEY (game_id, payment_method_id),
  CONSTRAINT allow_payment_method_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.game(game_id),
  CONSTRAINT allow_payment_method_payment_method_id_fkey FOREIGN KEY (payment_method_id) REFERENCES public.payment_method(payment_method_id)
);

CREATE TABLE public.use (
  game_id integer NOT NULL,
  process_id integer NOT NULL,
  CONSTRAINT use_pkey PRIMARY KEY (game_id, process_id),
  CONSTRAINT use_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.game(game_id),
  CONSTRAINT use_process_id_fkey FOREIGN KEY (process_id) REFERENCES public.add_value_process(process_id)
);


-- ========= SYNC USER DATA =========
-- Function and Trigger to automatically copy new users from auth.users to public.is_admin

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert the new user's ID into the is_admin table.
  -- is_admin will default to false.
  INSERT INTO public.is_admin (user_id)
  VALUES (new.id);
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert existing users from auth.users into public.is_admin
INSERT INTO public.is_admin (user_id)
SELECT 
    id
FROM 
    auth.users
ON CONFLICT (user_id) DO NOTHING;