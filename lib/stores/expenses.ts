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
  add: async (groupId: string, localData: ExpenseInput) => {
    // update local state first
    set((state) => ({
      items: [...state.items, localData],
    }));

    // update remote state
    const remoteData = {
      ...pick(localData, ['name', 'amount', 'date']),
      handled_by: localData.handledBy?.id,
      category_id: localData.category?.id,
    };
    const updated = await addExpense(
      groupId,
      remoteData,
      localData.participants
    );
    updated.handledBy = localData.handledBy;
    updated.category = localData.category;

    // update local state again
    set((state) => ({
      items: state.items.map((item) =>
        item.id === localData.id ? updated : item
      ),
    }));
  },
  update: async (expenseId: string, localData: ExpenseInput) => {
    // update local state first
    set((state) => ({
      items: state.items.map((item) =>
        item.id === expenseId ? localData : item
      ),
    }));

    // update remote state
    const remoteData = {
      ...pick(localData, ['name', 'amount', 'date']),
      handled_by: localData.handledBy?.id,
      category_id: localData.category?.id,
    };
    const updated = await updateExpense(
      expenseId,
      remoteData,
      localData.participants
    );
    updated.handledBy = localData.handledBy;
    updated.category = localData.category;

    // update local state again
    set((state) => ({
      items: state.items.map((item) =>
        item.id === localData.id ? updated : item
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
