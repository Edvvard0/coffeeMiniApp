import { create } from 'zustand';
import type { User, Order } from '../types';

interface UserState {
  user: User | null;
  orders: Order[];
  setUser: (user: User | null) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  orders: [],

  setUser: (user) => set({ user }),

  addOrder: (order) => set((state) => ({
    orders: [order, ...state.orders],
  })),

  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      ),
    })),
}));

