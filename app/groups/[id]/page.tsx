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
      <Members />
      <div className="flex items-center space-x-4 h-8">
        <ManageMembers />
        <Separator orientation="vertical" />
        <ExpenseInput />
      </div>
      <Expenses />
    </div>
  );
}
