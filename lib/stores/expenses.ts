import { create } from 'zustand';
import { Member } from './members';

export type Expense = {
  id: string;
  name: string;
  amount: string;
  category: { id: string; name: string };
  handledBy: Member;
  participants: Member[];
  date: Date;
};

type ExpensesState = {
  items: Expense[];
  add: (item: Expense) => void;
};

export const useExpensesStore = create<ExpensesState>((set) => ({
  items: [],
  add: (item: Expense) => set((state) => ({ items: [item, ...state.items] })),
}));
