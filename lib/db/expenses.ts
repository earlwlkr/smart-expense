import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { Category, Expense, Member } from '../types';
import supabase from './init';
import { first, get } from 'lodash-es';

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
  const { data: participants } = await supabase
    .from('participants')
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
      `
    )
    .in('expense_id', data?.map<Expense>((i) => i.id) || []);

  return (
    data?.map<Expense>((item) => ({
      ...item,
      handledBy: item.members as unknown as Member,
      category: item.categories as unknown as Category,
      participants:
        (participants || [])
          .filter((participant) => get(participant.expenses, 'id') === item.id)
          .map(
            (participant) =>
              (first<Member>(participant.members) as Member) ||
              participant.members
          ) || [],
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

export const addExpense = async (
  groupId: string,
  expense: ExpenseInput,
  participants: Member[]
) => {
  const supabase = createClientComponentClient();
  const user = await supabase.auth.getUser();
  const { data: inserted, error } = await supabase
    .from('expenses')
    .insert({ ...expense, groupId, user_id: user.data.user?.id })
    .select()
    .single();
  participants.forEach(async (participant) => {
    await supabase
      .from('participants')
      .insert({ expense_id: inserted.id, member_id: participant.id });
  });
};
