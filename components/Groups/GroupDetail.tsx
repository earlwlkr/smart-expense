"use client";

import { AnalyticsView } from "@/components/Analytics/AnalyticsView";

import { ExpenseSplit } from "@/components/Expenses/ExpenseSplit";
import { Expenses } from "@/components/Expenses/Expenses";
import { GroupEditModal } from "@/components/GroupEdit/GroupEditModal";
import { ComponentLoading } from "@/components/ui/component-loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCategories } from "@/lib/contexts/CategoriesContext";
import { useExpensesStore } from "@/lib/contexts/ExpensesContext";
import { useGroups } from "@/lib/contexts/GroupsContext";
import { useMembers } from "@/lib/contexts/MembersContext";
import { useShareTokens } from "@/lib/contexts/ShareTokensContext";
import { useTokens } from "@/lib/contexts/TokensContext";


export function GroupDetail({ groupId }: { groupId: string }) {
  const { currentGroup, loading } = useGroups();

  // Data fetching is now handled by Contexts which use Convex hooks
  // No need for useEffects here


  return (
    <ComponentLoading
      isLoading={loading}
      loadingMessage="Loading group details..."
    >
      {!currentGroup ? (
        <div className="text-center text-muted-foreground py-8">
          No group selected
        </div>
      ) : (
        <div className="">
          <div className="flex justify-center mb-2">
            <GroupEditModal />
          </div>
          <Tabs defaultValue="expenses" className="mt-2">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="split">Split</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="expenses">
              <Expenses />
            </TabsContent>
            <TabsContent value="split">
              <ExpenseSplit />
            </TabsContent>
            <TabsContent value="analytics">
              <AnalyticsView />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </ComponentLoading>
  );
}
