'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Dispatch, SetStateAction, useState } from 'react';
import { useMediaQuery } from '@uidotdev/usehooks';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ExpenseForm } from '@/components/Expenses/ExpenseForm';
import { Expense } from '@/lib/types';

export function AddExpenseButton({
  open,
  setOpen,
  expense,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  expense?: Expense;
}) {
  const isSmallDevice = useMediaQuery('only screen and (max-width : 768px)');

  return isSmallDevice ? (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Add expense</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Add Expense</SheetTitle>
        </SheetHeader>
        <ExpenseForm setOpen={setOpen} expense={expense} />
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add expense</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <ExpenseForm setOpen={setOpen} expense={expense} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
