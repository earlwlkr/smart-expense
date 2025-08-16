import React, { createContext, useContext, useState, useCallback } from 'react';
import { Category } from '@/lib/types';
import * as db from '@/lib/db/categories';

type CategoriesContextType = {
  categories: Category[];
  loading: boolean;
  fetchCategories: (groupId: string) => Promise<void>;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  addCategories: (groupId: string, categories: string[]) => Promise<void>;
  removeCategory: (categoryId: string) => Promise<void>;
};

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = useCallback(async (groupId: string) => {
    setLoading(true);
    const cats = await db.getCategories(groupId);
    setCategories(cats);
    setLoading(false);
  }, []);

  const addCategories = useCallback(async (groupId: string, names: string[]) => {
    setLoading(true);
    await db.addCategories(groupId, names);
    await fetchCategories(groupId);
    setLoading(false);
  }, [fetchCategories]);

  const removeCategory = useCallback(async (categoryId: string) => {
    setLoading(true);
    await db.removeCategory(categoryId);
    // Optionally refetch or filter locally
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
    setLoading(false);
  }, []);

  return (
    <CategoriesContext.Provider
      value={{ categories, loading, fetchCategories, addCategories, removeCategory, setCategories }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error('useCategories must be used within a CategoriesProvider');
  return ctx;
};
