'use client';

import { useEffect } from 'react';
import { ExpenseSplit } from '@/components/Expenses/ExpenseSplit';
import { Expenses } from '@/components/Expenses/Expenses';
import { GroupEditModal } from '@/components/GroupEdit/GroupEditModal';
import { GroupStats } from '@/components/Groups/GroupStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icons } from '@/components/ui/icons';
import { useCategories } from '@/lib/contexts/CategoriesContext';
import { useExpensesStore } from '@/lib/contexts/ExpensesContext';
import { useGroups } from '@/lib/contexts/GroupsContext';
import { useMembers } from '@/lib/contexts/MembersContext';
import { useTokens } from '@/lib/contexts/TokensContext';
import { useShareTokens } from '@/lib/contexts/ShareTokensContext';
import { getExpenses } from '@/lib/db/expenses';
import { getMembers } from '@/lib/db/members';
import { getInviteToken } from '@/lib/db/tokens';
import { getShareToken } from '@/lib/db/shareTokens';

export function GroupDetail({ groupId }: { groupId: string }) {
  const { currentGroup, getGroupDetail, loading: groupsLoading } = useGroups();

  const { fetchCategories } = useCategories();
  const { set: setExpenses, setLoading: setExpensesLoading } = useExpensesStore();
  const { updateMembers } = useMembers();
  const { setInviteToken } = useTokens();
  const { setShareToken } = useShareTokens();

  useEffect(() => {
    let isActive = true;

    const loadGroupData = async () => {
      await getGroupDetail(groupId);
      await fetchCategories(groupId);

      setExpensesLoading(true);
      try {
        const [expenses, members, inviteToken, shareToken] = await Promise.all([
          getExpenses(groupId),
          getMembers(groupId),
          getInviteToken(groupId),
          getShareToken(groupId),
        ]);

        if (!isActive) return;

        setExpenses(expenses);
        updateMembers(members);
        setInviteToken(inviteToken);
        setShareToken(shareToken);
      } finally {
        if (isActive) {
          setExpensesLoading(false);
        }
      }
    };

    void loadGroupData();

    return () => {
      isActive = false;
    };
  }, [
    groupId,
    getGroupDetail,
    fetchCategories,
    setExpenses,
    setExpensesLoading,
    updateMembers,
    setInviteToken,
    setShareToken,
  ]);

  if (groupsLoading && !currentGroup) {
    return (
      <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
        <Icons.spinner className="h-4 w-4 animate-spin" />
        Loading group...
      </div>
    );
  }

  if (!currentGroup) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        No group selected.
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex justify-center mb-2">
        <GroupEditModal />
      </div>
      <Tabs defaultValue="expenses" className="mt-2">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="split">Split</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>
        <TabsContent value="expenses">
          <Expenses />
        </TabsContent>
        <TabsContent value="split">
          <ExpenseSplit />
        </TabsContent>
        <TabsContent value="stats">
          <GroupStats />
        </TabsContent>
      </Tabs>
    </div>
  );
}
