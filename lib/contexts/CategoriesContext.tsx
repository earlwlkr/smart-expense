import React, { createContext, useContext, useState, ReactNode } from "react";
import { Category } from "../types";

type CategoriesState = {
  categories: Category[];
  add: (item: Category) => void;
  set: (categories: Category[]) => void;
  update: (categories: Category[]) => void;
};

const DEFAULT_CATEGORIES: Category[] = [
  { id: "1", name: "Food" },
  { id: "2", name: "Drinks" },
];

const CategoriesContext = createContext<CategoriesState | undefined>(undefined);

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);

  const add = (item: Category) => setCategories((prev) => [...prev, item]);
  const set = (categories: Category[]) => setCategories(categories);
  const update = (categories: Category[]) => setCategories(categories);

  return (
    <CategoriesContext.Provider value={{ categories, add, set, update }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategoriesStore = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error(
      "useCategoriesStore must be used within a CategoriesProvider"
    );
  }
  return context;
};
