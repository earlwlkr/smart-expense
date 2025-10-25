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
  loading: boolean;
  setLoading: (value: boolean) => void;
  add: (groupId: string, item: ExpenseInput) => Promise<void>;
  update: (expenseId: string, item: ExpenseInput) => Promise<void>;
  set: (items: Expense[]) => void;
  remove: (expenseId: string) => Promise<void>;
};

const ExpensesContext = createContext<ExpensesState | undefined>(undefined);

export const ExpensesProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);

  const add = useCallback(
    async (groupId: string, localData: ExpenseInput) => {
      setLoading(true);
      setItems((prev) => [...prev, localData]);

      try {
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
      } catch (error) {
        console.error('Failed to add expense', error);
        setItems((prev) => prev.filter((item) => item.id !== localData.id));
      } finally {
        setLoading(false);
      }
    },
    [setItems]
  );

  const update = useCallback(
    async (expenseId: string, localData: ExpenseInput) => {
      setLoading(true);
      setItems((prev) =>
        prev.map((item) => (item.id === expenseId ? localData : item))
      );

      try {
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
      } catch (error) {
        console.error('Failed to update expense', error);
      } finally {
        setLoading(false);
      }
    },
    [setItems]
  );

  const set = useCallback(
    (newItems: Expense[]) => setItems(newItems),
    [setItems]
  );

  const remove = useCallback(
    async (expenseId: string) => {
      setLoading(true);
      setItems((prev) => prev.filter((item) => item.id !== expenseId));
      try {
        await removeExpense(expenseId);
      } catch (error) {
        console.error('Failed to remove expense', error);
      } finally {
        setLoading(false);
      }
    },
    [setItems]
  );

  const setLoadingState = useCallback((value: boolean) => setLoading(value), []);

  return (
    <ExpensesContext.Provider
      value={{
        items,
        loading,
        setLoading: setLoadingState,
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
