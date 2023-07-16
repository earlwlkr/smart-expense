import { Expenses } from '@/components/Expenses';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="container">
      <Expenses />
    </div>
  );
}
