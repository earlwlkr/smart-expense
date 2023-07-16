import { create } from 'zustand';

export const useExpensesStore = create((set) => ({
  items: [],
  add: (item) => set((state) => ({ items: [item, ...state.items] })),
}));
