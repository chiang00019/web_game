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

export interface Banner {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'announcement';
  isActive: boolean;
  createdAt: string;
}
