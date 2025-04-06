import { create } from 'zustand';
import { pick } from 'lodash-es';
import { Category, Expense, Member } from '../types';
import { addExpense, removeExpense, updateExpense } from '../db/expenses';

type ExpensesState = {
  items: Expense[];
  add: (groupId: string, item: ExpenseInput) => void;
  update: (expenseId: string, item: ExpenseInput) => void;
  set: (items: Expense[]) => void;
  remove: (expenseId: string) => void;
};

type ExpenseInput = Omit<Expense, 'category' | 'handledBy'> & {
  category?: Category;
  handledBy?: Member;
};

export const useExpensesStore = create<ExpensesState>((set) => ({
  items: [],
  add: async (groupId: string, item: ExpenseInput) => {
    const remoteData = {
      ...pick(item, ['name', 'amount', 'date']),
      handled_by: item.handledBy?.id,
      category_id: item.category?.id,
    };
    const inserted = await addExpense(
      groupId,
      remoteData,
      item.participants || []
    );
    set((state) => ({
      items: [...state.items, inserted],
    }));
  },
  update: async (expenseId: string, item: ExpenseInput) => {
    const remoteData = {
      ...pick(item, ['name', 'amount', 'date']),
      handled_by: item.handledBy?.id,
      category_id: item.category?.id,
    };
    const updated = await updateExpense(
      expenseId,
      remoteData,
      item.participants || []
    );
    set((state) => ({
      items: state.items.map((item) =>
        item.id === expenseId ? updated : item
      ),
    }));
  },
  set: (items: Expense[]) => set({ items }),
  remove: (expenseId: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== expenseId),
    }));
    removeExpense(expenseId);
  },
}));
