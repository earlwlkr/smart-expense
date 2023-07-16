import { ExpenseInput } from '@/components/ExpenseInput';
import { Expenses } from '@/components/Expenses';

export default function Home() {
  return (
    <div className="container">
      <ExpenseInput />
      <Expenses />
    </div>
  );
}
