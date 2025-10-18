'use client';

import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useExpensesStore } from '@/lib/contexts/ExpensesContext';

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

export function GroupStats() {
  const { items: expenses } = useExpensesStore();

  type Aggregate = { id: string; name: string; amount: number };
  type Stats = {
    totalAmount: number;
    largestExpense: Aggregate | null;
    average: number;
    count: number;
    payerTotals: Aggregate[];
    categoryTotals: Aggregate[];
  };

  const stats = useMemo<Stats>(() => {
    const totalsByPayer = new Map<string, Aggregate>();
    const totalsByCategory = new Map<string, Aggregate>();

    let totalAmount = 0;
    let largestExpense: Aggregate | null = null;

    expenses.forEach((expense) => {
      const amount = Number(expense.amount) || 0;
      totalAmount += amount;

      if (!largestExpense || amount > largestExpense.amount) {
        largestExpense = {
          id: expense.id,
          name: expense.name,
          amount,
        };
      }

      const payerKey = expense.handledBy?.id ?? '__unassigned__';
      const payerName = expense.handledBy?.name ?? 'Unassigned';
      const existingPayer = totalsByPayer.get(payerKey);
      if (existingPayer) {
        existingPayer.amount += amount;
      } else {
        totalsByPayer.set(payerKey, { id: payerKey, name: payerName, amount });
      }

      const categoryKey = expense.category?.id ?? '__uncategorized__';
      const categoryName = expense.category?.name ?? 'Uncategorized';
      const existingCategory = totalsByCategory.get(categoryKey);
      if (existingCategory) {
        existingCategory.amount += amount;
      } else {
        totalsByCategory.set(categoryKey, {
          id: categoryKey,
          name: categoryName,
          amount,
        });
      }
    });

    const count = expenses.length;
    const average = count > 0 ? totalAmount / count : 0;

    const payerTotals = Array.from(totalsByPayer.values()).sort(
      (a, b) => b.amount - a.amount,
    );

    const categoryTotals = Array.from(totalsByCategory.values()).sort(
      (a, b) => b.amount - a.amount,
    );

    return {
      totalAmount,
      largestExpense,
      average,
      count,
      payerTotals,
      categoryTotals,
    };
  }, [expenses]);

  if (!expenses.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No expenses yet</CardTitle>
          <CardDescription>
            Add your first expense to see group statistics.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardDescription>Total spent</CardDescription>
            <CardTitle>{currencyFormatter.format(stats.totalAmount)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Number of expenses</CardDescription>
            <CardTitle>{stats.count}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Average expense</CardDescription>
            <CardTitle>{currencyFormatter.format(stats.average)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Largest expense</CardDescription>
            <CardTitle>
              {stats.largestExpense
                ? `${stats.largestExpense.name} · ${currencyFormatter.format(stats.largestExpense.amount)}`
                : '—'}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Spend by payer</CardTitle>
            <CardDescription>
              Who covered the expenses for the group.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.payerTotals.map((payer) => (
                  <TableRow key={payer.id}>
                    <TableCell>{payer.name}</TableCell>
                    <TableCell className="text-right">
                      {currencyFormatter.format(payer.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Spend by category</CardTitle>
            <CardDescription>
              How the expenses are distributed across categories.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.categoryTotals.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell className="text-right">
                      {currencyFormatter.format(category.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
