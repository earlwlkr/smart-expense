import { create } from 'zustand';

type Expense = {
  name: string;
  amount: string;
  category: string;
};

export const useExpensesStore = create<{ items: Expense[] }>((set) => ({
  items: [],
  add: (item: Expense) => set((state) => ({ items: [item, ...state.items] })),
}));
