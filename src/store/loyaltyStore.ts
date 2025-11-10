import { create } from 'zustand';
import type { LoyaltyProgram, LoyaltyTransaction } from '../types';

interface LoyaltyState extends LoyaltyProgram {
  addPoints: (points: number, description: string, orderId?: string) => void;
  spendPoints: (points: number, description: string) => boolean;
  reset: () => void;
}

const initialRules = {
  pointsPerRub: 1,
  minOrderForPoints: 100,
};

export const useLoyaltyStore = create<LoyaltyState>((set, get) => ({
  balance: 0,
  transactions: [],
  rules: initialRules,

  addPoints: (points, description, orderId) => {
    const transaction: LoyaltyTransaction = {
      id: `tx-${Date.now()}`,
      type: 'earned',
      points,
      description,
      orderId,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      balance: state.balance + points,
      transactions: [transaction, ...state.transactions],
    }));
  },

  spendPoints: (points, description) => {
    if (get().balance < points) {
      return false;
    }

    const transaction: LoyaltyTransaction = {
      id: `tx-${Date.now()}`,
      type: 'spent',
      points,
      description,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      balance: state.balance - points,
      transactions: [transaction, ...state.transactions],
    }));

    return true;
  },

  reset: () => {
    set({
      balance: 0,
      transactions: [],
      rules: initialRules,
    });
  },
}));

