import { Category, Expense, Member } from '../types';
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
      handledBy: item.members as unknown as Member,
      category: item.categories as unknown as Category,
      participants: [],
    })) || []
  );
};

type ExpenseInput = Omit<
  Expense,
  'category' | 'handledBy' | 'id' | 'participants'
> & {
  category?: string;
  handledBy?: string;
};

export const addExpense = async (groupId: string, expense: ExpenseInput) => {
  const { error } = await supabase
    .from('expenses')
    .insert({ ...expense, groupId });
};
