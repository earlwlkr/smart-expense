import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { ShareGroupView } from '@/components/Share/ShareGroupView';
import { createClient } from '@/lib/supabase/server';
import type { Expense, Member } from '@/lib/types';

type SharePageParams = {
  token: string;
};

type ShareTokenRow = {
  id: string;
  group_id: string;
  disabled: boolean;
  expires_at: string | null;
  groups?: {
    id: string;
    name: string;
  } | null;
};

type ExpenseRow = {
  id: string;
  name: string;
  amount: string;
  date: string;
  categories: { id: string; name: string } | null;
  handled_by: { id: string; name: string } | null;
};

type ParticipantRow = {
  expense_id: string;
  members: Member | Member[] | null;
};

export default async function SharePage({
  params,
}: {
  params: Promise<SharePageParams>;
}) {
  const { token } = await params;
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: tokenRow } = await supabase
    .from('share_tokens')
    .select(
      `
        id,
        group_id,
        disabled,
        expires_at,
        groups (
          id,
          name
        )
      `,
    )
    .eq('id', token)
    .single();

  const shareToken = tokenRow as ShareTokenRow | null;

  if (!shareToken) {
    notFound();
  }

  const expiresAt = shareToken.expires_at
    ? new Date(shareToken.expires_at)
    : null;

  if (shareToken.disabled || (expiresAt && expiresAt < new Date())) {
    notFound();
  }

  const groupId = shareToken.group_id;
  const groupName = shareToken.groups?.name || 'Shared group';

  const { data: membersData } = await supabase
    .from('members')
    .select('id, name')
    .eq('group_id', groupId)
    .order('name');

  const { data: expensesData } = await supabase
    .from('expenses')
    .select(
      `
        id,
        name,
        amount,
        date,
        categories (
          id,
          name
        ),
        handled_by (
          id,
          name
        )
      `,
    )
    .eq('group_id', groupId)
    .order('date');

  const expenseIds = expensesData?.map((expense) => expense.id) || [];
  const { data: participantsData } = await supabase
    .from('participants')
    .select(
      `
        id,
        expense_id,
        members (
          id,
          name
        )
      `,
    )
    .in('expense_id', expenseIds);

  const expenseRows = (expensesData as ExpenseRow[]) || [];
  const participantRows = (participantsData as ParticipantRow[]) || [];

  const expenses: Expense[] = expenseRows.map((expense) => ({
      id: expense.id,
      name: expense.name,
      amount: expense.amount,
      date: new Date(expense.date),
      category: expense.categories || undefined,
      handledBy: expense.handled_by || undefined,
      participants:
        participantRows
          .filter((participant) => participant.expense_id === expense.id)
          .map((participant) => {
            const member = participant.members;
            if (Array.isArray(member)) {
              return member[0];
            }
            return member;
          })
          .filter(Boolean) || [],
    }));

  const members: Member[] = (membersData as Member[]) || [];

  return (
    <ShareGroupView groupName={groupName} expenses={expenses} members={members} />
  );
}
