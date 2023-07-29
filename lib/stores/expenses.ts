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
    addExpense(groupId, pick(item, ['name', 'amount', 'date', 'handledBy']));
    set((state) => ({ items: [item, ...state.items] }));
  },
  set: (items: Expense[]) => set({ items }),
}));
