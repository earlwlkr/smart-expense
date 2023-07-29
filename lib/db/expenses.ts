import { Expense } from '../types';
import supabase from './init';

export const getExpenses = async (groupId: string): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from('expenses')
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
    members (
      id,
      name
    )
    `
    )
    .eq('groupId', groupId);
  return (
    data?.map<Expense>((item) => ({
      ...item,
      handledBy: item.members,
      category: item.categories,
      participants: [],
    })) || []
  );
};

export const addExpense = async (
  groupId: string,
  expense: Partial<Expense>
) => {
  const { error } = await supabase
    .from('expenses')
    .insert({ ...expense, groupId });
};
