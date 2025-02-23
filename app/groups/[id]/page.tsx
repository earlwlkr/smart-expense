'use client';

import { ExpenseInput } from '@/components/ExpenseInput';
import { Expenses } from '@/components/Expenses';
import { ManageMembers } from '@/components/ManageMembers';
import { Members } from '@/components/Members';
import { useGroupsStore } from '@/lib/stores/groups';
import { useInitStore } from '@/lib/stores/useInitStore';

export default function Dashboard({
  params: { id },
}: {
  params: { id: string };
}) {
  useInitStore(id);
  const group = useGroupsStore((store) => store.group);
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Expenses</h1>
      </div>
      <div className="flex mr-4">
        <Members />
      </div>
      <ManageMembers />
      <ExpenseInput />
      <Expenses />
    </>
  );
}
