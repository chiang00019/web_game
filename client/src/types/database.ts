export interface Profile {
  user_id: string;
  is_admin: boolean;
  user_name?: string;
}

export interface Game {
  game_id: number;
  game_name: string;
  category: string; // Changed from optional for consistency
  icon?: string;
  is_active: boolean;
}

export interface PaymentMethod {
  payment_method_id: number;
  method: string;
}

export interface Order {
  order_id: number;
  user_id: string; // Changed from optional as per db.sql
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
  created_at: string;
  updated_at?: string;
  game?: Game;
  payment_method?: PaymentMethod;
}

// Corrected Banner type to match the database schema and frontend usage
export interface Banner {
  banner_id: number;
  title: string;
  content: string;
  image_url?: string;
  link_url?: string;
  is_active: boolean;
  created_at: string;
}