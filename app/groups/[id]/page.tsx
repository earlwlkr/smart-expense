import { ExpenseInput } from '@/components/ExpenseInput';
import { Expenses } from '@/components/Expenses';
import { ManageMembers } from '@/components/ManageMembers';
import { Members } from '@/components/Members';

export default function GroupPage() {
  return (
    <div className="container mt-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Da Lat Trip
      </h1>
      <Members />
      <ManageMembers />
      <ExpenseInput />
      <Expenses />
    </div>
  );
}
