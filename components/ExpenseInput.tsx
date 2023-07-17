'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import { useExpensesStore } from '@/lib/expenses';
import { useToast } from '@/components/ui/use-toast';

export function ExpenseInput() {
  const { toast } = useToast();
  const addExpense = useExpensesStore((state) => state.add);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="py-4 flex flex-col lg:flex-row">
      <div className="lg:pr-4 pb-4 lg:pb-0">
        <Input ref={inputRef} type="text" placeholder="enter your expense..." />
      </div>

      <Button
        onClick={async () => {
          try {
            const response = await fetch('/api', {
              method: 'POST',
              body: JSON.stringify({
                q: inputRef.current?.value,
              }),
            });
            const result = await response.json();
            console.log('result', result);
            addExpense(result);
          } catch (error) {
            toast({
              title: 'Error',
              description: 'Cannot generate',
            });
          }
        }}
      >
        Add
      </Button>
    </div>
  );
}
