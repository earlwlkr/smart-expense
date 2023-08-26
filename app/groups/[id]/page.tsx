'use client';

import { ExpenseInput } from '@/components/ExpenseInput';
import { Expenses } from '@/components/Expenses';
import { ManageMembers } from '@/components/ManageMembers';
import { Members } from '@/components/Members';
import { Separator } from '@/components/ui/separator';
import { useGroupsStore } from '@/lib/stores/groups';
import { useInitStore } from '@/lib/stores/useInitStore';

export default function GroupPage({
  params: { id },
}: {
  params: { id: string };
}) {
  useInitStore(id);
  const group = useGroupsStore((store) => store.group);

  return (
    <div className="container mt-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {group.name}
      </h1>
      <div className="lg:items-center grid grid-cols-1 lg:inline-flex">
        <div className="flex mr-4">
          <Members />
        </div>
        <div className="flex mr-4">
          <ManageMembers />
          <div className="flex">
            <Separator orientation="vertical" className="mx-4" />
            <ExpenseInput />
          </div>
        </div>
      </div>
      <Expenses />
    </div>
  );
}
