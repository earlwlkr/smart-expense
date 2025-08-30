'use client';

import { Dispatch, SetStateAction } from 'react';
import { useMediaQuery } from '@uidotdev/usehooks';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ExpenseForm } from '@/components/Expenses/ExpenseForm';
import type { Expense } from '@/lib/types';

export function AddExpenseButton({
  open,
  setOpen,
  expense,
  setExpense,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  expense?: Expense | null;
  setExpense: Dispatch<SetStateAction<Expense | null>>;
}) {
  const isSmallDevice = useMediaQuery('only screen and (max-width : 768px)');
  const onOpenChange = (open: boolean = false) => {
    setExpense(null);
    setOpen(open);
  };

  return isSmallDevice ? (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline">Add expense</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Add Expense</SheetTitle>
        </SheetHeader>
        <ExpenseForm onClose={onOpenChange} expense={expense} />
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Add expense</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <ExpenseForm onClose={onOpenChange} expense={expense} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
