'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Expenses } from '@/components/Expenses/Expenses';
import { ExpenseSplit } from '@/components/Expenses/ExpenseSplit';
import { GroupEditModal } from '@/components/GroupEdit/GroupEditModal';
import { useGroups } from '@/lib/contexts/GroupsContext';
import { useCategories } from '@/lib/contexts/CategoriesContext';
import { useExpensesStore } from '@/lib/contexts/ExpensesContext';
import { getExpenses } from '@/lib/db/expenses';
import { getMembers } from '@/lib/db/members';
import { getActiveTokens } from '@/lib/db/tokens';
import { useTokensStore } from '@/lib/stores/tokens';
import { useEffect } from 'react';
import { useMembers } from '@/lib/contexts/MembersContext';

export function GroupDetail({ groupId }: { groupId: string }) {
  const { currentGroup, getGroupDetail } = useGroups();

  const { fetchCategories, setCategories } = useCategories();
  const { set: setExpenses } = useExpensesStore();
  const { updateMembers } = useMembers();
  const setTokens = useTokensStore((store) => store.set);

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

    getGroupDetail(groupId);
    fetchCategories(groupId);
    initExpenses();
    initMembers();
    initTokens();
  }, [
    groupId,
    getGroupDetail,
    fetchCategories,
    setCategories,
    setExpenses,
    updateMembers,
    setTokens,
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
