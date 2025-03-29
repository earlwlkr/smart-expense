'use client';

import * as React from 'react';

import { useExpensesStore } from '@/lib/stores/expenses';
import { format } from 'date-fns';
import { AddExpenseButton } from '@/components/AddExpenseButton';
import { useState } from 'react';
import { Expense } from '@/lib/types';

export function Expenses() {
  const expenses = useExpensesStore((state) => state.items);
  const [open, setOpen] = useState(false);
  const [expense, setExpense] = useState<Expense>(null);

  return (
    <div className="flex flex-col w-full pb-4">
      <div className="mt-4 mb-2 flex justify-between items-end">
        <AddExpenseButton open={open} setOpen={setOpen} expense={expense} />
        <div>
          <strong>Total:</strong>{' '}
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(
            expenses.reduce((sum, item) => {
              return sum + Number(item.amount);
            }, 0)
          )}
        </div>
      </div>
      <div className="rounded-md border">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="p-4 border-b"
            onClick={() => {
              setExpense(expense);
              setOpen(true);
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-medium">{expense.name}</div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(expense.date), 'PP')}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-medium">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(Number(expense.amount))}
                </div>
                <div className="text-sm text-muted-foreground">
                  {expense.category?.name}
                </div>
              </div>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              <div>
                With:{' '}
                {expense.participants
                  .sort((memberA, memberB) =>
                    memberA.name.localeCompare(memberB.name)
                  )
                  .map((p) => p.name)
                  .join(', ')}
              </div>
              <div>By: {expense.handledBy?.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
