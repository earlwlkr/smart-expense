import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { pick } from 'lodash-es';
import { Category, Expense, Member } from '../types';
import { addExpense, removeExpense, updateExpense } from '../db/expenses';

type ExpenseInput = Omit<Expense, 'category' | 'handledBy'> & {
  category?: Category;
  handledBy?: Member;
};

type ExpensesState = {
  items: Expense[];
  add: (groupId: string, item: ExpenseInput) => Promise<void>;
  update: (expenseId: string, item: ExpenseInput) => Promise<void>;
  set: (items: Expense[]) => void;
  remove: (expenseId: string) => Promise<void>;
};

const ExpensesContext = createContext<ExpensesState | undefined>(undefined);

export const ExpensesProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Expense[]>([]);

  const add = useCallback(
    async (groupId: string, localData: ExpenseInput) => {
      setItems((prev) => [...prev, localData]);

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

      setItems((prev) =>
        prev.map((item) => (item.id === localData.id ? updated : item))
      );
    },
    [setItems]
  );

  const update = useCallback(
    async (expenseId: string, localData: ExpenseInput) => {
      setItems((prev) =>
        prev.map((item) => (item.id === expenseId ? localData : item))
      );

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

      setItems((prev) =>
        prev.map((item) => (item.id === localData.id ? updated : item))
      );
    },
    [setItems]
  );

  const set = useCallback(
    (newItems: Expense[]) => setItems(newItems),
    [setItems]
  );

  const remove = useCallback(
    async (expenseId: string) => {
      setItems((prev) => prev.filter((item) => item.id !== expenseId));
      await removeExpense(expenseId);
    },
    [setItems]
  );

  return (
    <ExpensesContext.Provider
      value={{
        items,
        add,
        update,
        set,
        remove,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
};

export const useExpensesStore = () => {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error('useExpensesStore must be used within an ExpensesProvider');
  }
  return context;
};
