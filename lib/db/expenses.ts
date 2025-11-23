import { first, get } from "lodash-es";
import type { Category, Expense, Member } from "../types";
import supabase from "./init";

export const getExpenses = async (groupId: string): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from("expenses")
    .select(
      `
    id,
    name,
    amount,
    categories (
      id,
      name
    ),
    date,
    handled_by (
      id,
      name
    )
    `,
    )
    .eq("group_id", groupId)
    .order("created_at");
  const { data: participants } = await supabase
    .from("participants")
    .select(
      `
      id,
      expenses (
        id
      ),
      members (
        id,
        name
      )
      `,
    )
    .in("expense_id", data?.map<Expense>((i) => i.id) || []);

  return (
    data?.map<Expense>((item) => ({
      ...item,
      handledBy: item.handled_by as unknown as Member,
      category: item.categories as unknown as Category,
      participants:
        (participants || [])
          .filter((participant) => get(participant.expenses, "id") === item.id)
          .map(
            (participant) =>
              (first<Member>(participant.members) as Member) ||
              participant.members,
          ) || [],
    })) || []
  );
};

type ExpenseInput = Omit<
  Expense,
  "category" | "handledBy" | "id" | "participants"
> & {
  category?: string;
  handledBy?: string;
};

export const addExpense = async (
  groupId: string,
  expense: ExpenseInput,
  participants: Member[],
) => {
  const user = await supabase.auth.getUser();
  const { data: inserted, error } = await supabase
    .from("expenses")
    .insert({
      ...expense,
      group_id: groupId,
      // created_by: user.data.user?.id,
    })
    .select()
    .single();
  participants.forEach(async (participant) => {
    await supabase
      .from("participants")
      .insert({ expense_id: inserted.id, member_id: participant.id });
  });
  inserted.participants = participants;
  return inserted as Expense;
};

export const updateExpense = async (
  expenseId: string,
  expense: ExpenseInput,
  participants: Member[],
) => {
  const { data: updated, error } = await supabase
    .from("expenses")
    .update(expense)
    .eq("id", expenseId)
    .select()
    .single();
  await supabase.from("participants").delete().eq("expense_id", expenseId);
  participants.forEach(async (participant) => {
    await supabase
      .from("participants")
      .insert({ expense_id: expenseId, member_id: participant.id });
  });
  updated.participants = participants;
  return updated as Expense;
};

export const removeExpense = async (expenseId: string) => {
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", expenseId);
};
