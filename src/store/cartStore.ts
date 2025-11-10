import { create } from 'zustand';
import type { CartItem, DeliveryType, Product } from '../types';
import { DELIVERY_PRICE, FREE_DELIVERY_THRESHOLD } from '../utils/constants';

interface CartState {
  items: CartItem[];
  deliveryType: DeliveryType;
  deliveryAddress?: string;
  
  // Computed values
  subtotal: number;
  deliveryPrice: number;
  total: number;
  
  // Actions
  addItem: (product: Product, quantity?: number, options?: Record<string, string>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  setDeliveryType: (type: DeliveryType) => void;
  setDeliveryAddress: (address: string) => void;
  clearCart: () => void;
}

const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => {
    let itemPrice = item.product.price;
    
    // Add options prices
    if (item.selectedOptions) {
      Object.entries(item.selectedOptions).forEach(([optionId, valueId]) => {
        const option = item.product.options?.find(opt => opt.id === optionId);
        const value = option?.values.find(v => v.id === valueId);
        if (value) {
          itemPrice += value.price;
        }
      });
    }
    
    return sum + itemPrice * item.quantity;
  }, 0);
};

const calculateDeliveryPrice = (subtotal: number, deliveryType: DeliveryType): number => {
  if (deliveryType === 'pickup') return 0;
  if (subtotal >= FREE_DELIVERY_THRESHOLD) return 0;
  return DELIVERY_PRICE;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  deliveryType: 'pickup',
  deliveryAddress: undefined,
  subtotal: 0,
  deliveryPrice: 0,
  total: 0,

  addItem: (product, quantity = 1, options = {}) => {
    const items = get().items;
    const existingItemIndex = items.findIndex(
      (item) =>
        item.product.id === product.id &&
        JSON.stringify(item.selectedOptions) === JSON.stringify(options)
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += quantity;
      set({ items: updatedItems });
    } else {
      // Add new item
      const newItem: CartItem = {
        id: `${product.id}-${Date.now()}`,
        product,
        quantity,
        selectedOptions: options,
      };
      set({ items: [...items, newItem] });
    }

    // Recalculate totals
    const newSubtotal = calculateSubtotal(get().items);
    const newDeliveryPrice = calculateDeliveryPrice(newSubtotal, get().deliveryType);
    set({
      subtotal: newSubtotal,
      deliveryPrice: newDeliveryPrice,
      total: newSubtotal + newDeliveryPrice,
    });
  },

  removeItem: (itemId) => {
    const items = get().items.filter((item) => item.id !== itemId);
    const newSubtotal = calculateSubtotal(items);
    const newDeliveryPrice = calculateDeliveryPrice(newSubtotal, get().deliveryType);
    set({
      items,
      subtotal: newSubtotal,
      deliveryPrice: newDeliveryPrice,
      total: newSubtotal + newDeliveryPrice,
    });
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }

    const items = get().items.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
    const newSubtotal = calculateSubtotal(items);
    const newDeliveryPrice = calculateDeliveryPrice(newSubtotal, get().deliveryType);
    set({
      items,
      subtotal: newSubtotal,
      deliveryPrice: newDeliveryPrice,
      total: newSubtotal + newDeliveryPrice,
    });
  },

  setDeliveryType: (type) => {
    const newDeliveryPrice = calculateDeliveryPrice(get().subtotal, type);
    set({
      deliveryType: type,
      deliveryPrice: newDeliveryPrice,
      total: get().subtotal + newDeliveryPrice,
    });
  },

  setDeliveryAddress: (address) => {
    set({ deliveryAddress: address });
  },

  clearCart: () => {
    set({
      items: [],
      subtotal: 0,
      deliveryPrice: 0,
      total: 0,
      deliveryAddress: undefined,
    });
  },
}));

