import { create } from 'zustand';
import { pick } from 'lodash-es';
import { Expense } from '../types';
import { addExpense } from '../db/expenses';

type ExpensesState = {
  items: Expense[];
  add: (groupId: string, item: Expense) => void;
  set: (items: Expense[]) => void;
};

export const useExpensesStore = create<ExpensesState>((set) => ({
  items: [],
  add: (groupId: string, item: Expense) => {
    const data = {
      ...pick(item, ['name', 'amount', 'date']),
      handledBy: item.handledBy?.id,
      category: item.category?.id,
    };
    addExpense(groupId, data);
    set((state) => ({ items: [...state.items, item] }));
  },
  set: (items: Expense[]) => set({ items }),
}));
