import { create } from 'zustand';

export type Category = {
  id: string;
  name: string;
};

type CategoriesState = {
  categories: Category[];
  add: (item: Category) => void;
};

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: [
    { id: '1', name: 'Food' },
    { id: '2', name: 'Drinks' },
  ],
  add: (item: Category) =>
    set((state) => ({ categories: [item, ...state.categories] })),
}));
