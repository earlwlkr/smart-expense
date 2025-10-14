'use client';

import { useEffect } from 'react';
import { ExpenseSplit } from '@/components/Expenses/ExpenseSplit';
import { Expenses } from '@/components/Expenses/Expenses';
import { GroupEditModal } from '@/components/GroupEdit/GroupEditModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCategories } from '@/lib/contexts/CategoriesContext';
import { useExpensesStore } from '@/lib/contexts/ExpensesContext';
import { useGroups } from '@/lib/contexts/GroupsContext';
import { useMembers } from '@/lib/contexts/MembersContext';
import { useTokens } from '@/lib/contexts/TokensContext';
import { useShareTokens } from '@/lib/contexts/ShareTokensContext';
import { getExpenses } from '@/lib/db/expenses';
import { getMembers } from '@/lib/db/members';
import { getActiveTokens } from '@/lib/db/tokens';
import { getActiveShareTokens } from '@/lib/db/shareTokens';

export function GroupDetail({ groupId }: { groupId: string }) {
  const { currentGroup, getGroupDetail } = useGroups();

  const { fetchCategories } = useCategories();
  const { set: setExpenses } = useExpensesStore();
  const { updateMembers } = useMembers();
  const { setTokens } = useTokens();
  const { setShareTokens } = useShareTokens();

  useEffect(() => {
    const initExpenses = async () => {
      const expenses = await getExpenses(groupId);
      setExpenses(expenses);
    };
    const initMembers = async () => {
      const members = await getMembers(groupId);
      updateMembers(members);
    };
    const initTokens = async () => {
      const tokens = await getActiveTokens(groupId);
      setTokens(tokens);
    };
    const initShareTokens = async () => {
      const tokens = await getActiveShareTokens(groupId);
      setShareTokens(tokens);
    };

    getGroupDetail(groupId);
    fetchCategories(groupId);
    initExpenses();
    initMembers();
    initTokens();
    initShareTokens();
  }, [
    groupId,
    getGroupDetail,
    fetchCategories,
    setExpenses,
    updateMembers,
    setTokens,
    setShareTokens,
  ]);

  if (!currentGroup) {
    return <div>No group selected</div>;
  }

  return (
    <div className="">
      <div className="flex justify-center mb-2">
        <GroupEditModal />
      </div>
      <Tabs defaultValue="expenses" className="mt-2">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="split">Split</TabsTrigger>
        </TabsList>
        <TabsContent value="expenses">
          <Expenses />
        </TabsContent>
        <TabsContent value="split">
          <ExpenseSplit />
        </TabsContent>
      </Tabs>
    </div>
  );
}
