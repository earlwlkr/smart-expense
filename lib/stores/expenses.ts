import { create } from 'zustand';
import { Member } from './members';

export type Expense = {
  id: string;
  name: string;
  amount: string;
  category: string;
  handledBy: Member;
  participants: Member[];
};

type ExpensesState = {
  items: Expense[];
  add: (item: Expense) => void;
};

export const useExpensesStore = create<ExpensesState>((set) => ({
  items: [],
  add: (item: Expense) => set((state) => ({ items: [item, ...state.items] })),
}));
