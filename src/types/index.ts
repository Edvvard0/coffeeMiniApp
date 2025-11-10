// Типы для товаров
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  categoryId: string;
  available: boolean;
  options?: ProductOption[];
  tags?: string[];
}

export interface ProductOption {
  id: string;
  name: string;
  type: 'size' | 'addon' | 'custom';
  required: boolean;
  values: OptionValue[];
}

export interface OptionValue {
  id: string;
  name: string;
  price: number;
}

// Типы для категорий
export interface Category {
  id: string;
  name: string;
  icon?: string;
  image?: string;
  description?: string;
}

// Типы для корзины
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedOptions?: Record<string, string>; // optionId -> valueId
  notes?: string;
}

export type DeliveryType = 'delivery' | 'pickup';

export interface Cart {
  items: CartItem[];
  deliveryType: DeliveryType;
  deliveryAddress?: string;
  deliveryPrice: number;
  subtotal: number;
  total: number;
}

// Типы для заказов
export interface Order {
  id: string;
  items: CartItem[];
  deliveryType: DeliveryType;
  deliveryAddress?: string;
  contactName: string;
  contactPhone: string;
  paymentMethod: 'online' | 'cash';
  subtotal: number;
  deliveryPrice: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: string;
  loyaltyPointsEarned?: number;
}

// Типы для программы лояльности
export interface LoyaltyTransaction {
  id: string;
  type: 'earned' | 'spent';
  points: number;
  description: string;
  orderId?: string;
  createdAt: string;
}

export interface LoyaltyProgram {
  balance: number;
  transactions: LoyaltyTransaction[];
  rules: {
    pointsPerRub: number; // баллов за рубль
    minOrderForPoints: number; // минимальная сумма заказа для начисления
  };
}

// Типы для чата
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'cafe';
  timestamp: string;
}

// Типы для пользователя
export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  addresses?: Address[];
}

export interface Address {
  id: string;
  street: string;
  building: string;
  apartment?: string;
  entrance?: string;
  floor?: string;
  comment?: string;
}

