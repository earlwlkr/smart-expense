'use client';

import { useInitStore } from '@/lib/stores/useInitStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Expenses } from '@/components/Expenses/Expenses';
import { ExpenseSplit } from '@/components/Expenses/ExpenseSplit';
import { GroupEditModal } from '@/components/GroupEdit/GroupEditModal';

export function GroupDetail({ id }: { id: string }) {
  useInitStore(id);
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex justify-center mb-2">
        <GroupEditModal />
      </div>
      <Tabs defaultValue="expenses" className="w-[400px] mt-2">
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
