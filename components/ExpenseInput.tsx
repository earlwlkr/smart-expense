'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import { useExpensesStore } from '@/lib/expenses';

export function ExpenseInput() {
  const addExpense = useExpensesStore((state) => state.add);
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <div className="py-4">
        <Input ref={inputRef} type="text" placeholder="enter your expense..." />
      </div>

      <Button
        onClick={async () => {
          const response = await fetch('/api', {
            method: 'POST',
            body: JSON.stringify({
              q: inputRef.current?.value,
            }),
          });
          const result = await response.json();
          console.log('result', result);
          addExpense(result);
        }}
      >
        Add
      </Button>
    </>
  );
}
