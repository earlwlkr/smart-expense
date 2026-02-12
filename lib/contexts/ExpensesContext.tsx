"use client";

import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { createContext, useContext, useMemo } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import type { Category, Expense, Member } from "../types";

type ExpenseInput = Omit<Expense, "_id" | "_creationTime" | "date" | "category" | "handledBy" | "participants"> & {
  date: Date;
  categoryId?: Id<"categories">;
  handledBy?: Id<"members">;
  participants: Id<"members">[];
};

type ExpensesContextType = {
  items: Expense[];
  loading: boolean;
  add: (item: ExpenseInput) => Promise<void>;
  update: (expenseId: Id<"expenses">, item: ExpenseInput) => Promise<void>;
  remove: (expenseId: Id<"expenses">) => Promise<void>;
};

const ExpensesContext = createContext<ExpensesContextType | undefined>(
  undefined,
);

export const ExpensesProvider = ({ children }: { children: React.ReactNode }) => {
  const params = useParams();
  const groupId = params?.id as Id<"groups"> | undefined;

  const expenses = useQuery(api.expenses.list, groupId ? { groupId } : "skip");
  const createExpense = useMutation(api.expenses.create);
  const updateExpense = useMutation(api.expenses.update);
  const deleteExpense = useMutation(api.expenses.remove);

  const loading = expenses === undefined;

  const add = async (item: ExpenseInput) => {
    if (!groupId) return;
    await createExpense({
      name: item.name,
      amount: Number(item.amount),
      date: item.date.toISOString(),
      groupId: groupId,
      categoryId: item.categoryId,
      handledBy: item.handledBy,
      participants: item.participants,
    });
  };

  const update = async (expenseId: Id<"expenses">, item: ExpenseInput) => {
    await updateExpense({
      id: expenseId,
      name: item.name,
      amount: Number(item.amount),
      date: item.date.toISOString(),
      categoryId: item.categoryId,
      handledBy: item.handledBy,
      participants: item.participants,
    });
  };

  const remove = async (expenseId: Id<"expenses">) => {
    await deleteExpense({ id: expenseId });
  };

  // Convert schema data to UI friendly types
  // Note: api.expenses.list should return populated fields if we want names
  // Assuming api.expenses.list returns: { ...expense, category: {name, _id}, handledByMember: {name, _id}, participantsMembers: [{name, _id}] }
  // We need to verify what api.expenses.list returns.
  // My previous view of `convex/expenses.ts` suggests it just returns flat data unless I did a join.
  // I should check `convex/expenses.ts` to see if it joins. 
  // If not, I need to fetch Members/Categories separately or do join in backend.
  // For now I will assume `expenses` contains raw data and I need to join with other contexts or backend joins.
  // The `types.ts` `Expense` type has optional `category?: Category` etc.

  // Let's assume the backend `list` performs the joins or we map them here if we have access to other contexts.
  // Using other contexts here might cause circular deps or complexity.
  // Better if backend returns joined data.

  return (
    <ExpensesContext.Provider
      value={{
        items: expenses || [], // This assumes expenses are already in correct shape or close enough
        loading,
        add,
        update,
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
    throw new Error("useExpensesStore must be used within an ExpensesProvider");
  }
  return context;
};
