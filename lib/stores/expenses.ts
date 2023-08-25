import { create } from 'zustand';
import { pick } from 'lodash-es';
import { Category, Expense, Member } from '../types';
import { addExpense } from '../db/expenses';

type ExpensesState = {
  items: Expense[];
  add: (groupId: string, item: ExpenseInput) => void;
  set: (items: Expense[]) => void;
};

type ExpenseInput = Omit<Expense, 'category' | 'handledBy'> & {
  category?: Category;
  handledBy?: Member;
};

export const useExpensesStore = create<ExpensesState>((set) => ({
  items: [],
  add: (groupId: string, item: ExpenseInput) => {
    const remoteData = {
      ...pick(item, ['name', 'amount', 'date']),
      handledBy: item.handledBy?.id,
      categoryId: item.category?.id,
    };
    addExpense(groupId, remoteData, item.participants || []);
    set((state) => ({ items: [...state.items, item] }));
  },
  set: (items: Expense[]) => set({ items }),
}));
