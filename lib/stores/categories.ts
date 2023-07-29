import { create } from 'zustand';
import { Category } from '../types';

type CategoriesState = {
  categories: Category[];
  add: (item: Category) => void;
  set: (categories: Category[]) => void;
};

const DEFAULT_CATEGORIES = [
  { id: '1', name: 'Food' },
  { id: '2', name: 'Drinks' },
];

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: DEFAULT_CATEGORIES,
  add: (item: Category) =>
    set((state) => ({ categories: [item, ...state.categories] })),
  set: (categories: Category[]) => set({ categories }),
}));
