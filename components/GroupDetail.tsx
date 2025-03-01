'use client';

import { useInitStore } from '@/lib/stores/useInitStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Expenses } from './Expenses';
import { ExpenseSplit } from './ExpenseSplit';
import { ManageMembers } from './ManageMembers';

export function GroupDetail({ id }: { id: string }) {
  useInitStore(id);
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex justify-center mb-2">
        <ManageMembers />
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
