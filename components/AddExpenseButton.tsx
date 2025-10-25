'use client';

import { useMediaQuery } from '@uidotdev/usehooks';
import { type Dispatch, memo, type SetStateAction } from 'react';
import { ExpenseForm } from '@/components/Expenses/ExpenseForm';
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
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { Expense } from '@/lib/types';

interface AddExpenseButtonProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  expense: Expense | null;
  setExpense: Dispatch<SetStateAction<Expense | null>>;
  disabled?: boolean;
}

const ExpenseFormWrapper = memo(
  ({
    onClose,
    expense,
  }: {
    onClose: (open?: boolean) => void;
    expense: Expense | null;
  }) => <ExpenseForm onClose={onClose} expense={expense} />,
);
ExpenseFormWrapper.displayName = 'ExpenseFormWrapper';

export function AddExpenseButton({
  open,
  setOpen,
  expense,
  setExpense,
  disabled = false,
}: AddExpenseButtonProps) {
  const isSmallDevice = useMediaQuery('only screen and (max-width : 768px)');

  const onOpenChange = (open: boolean = false) => {
    setExpense(null);
    setOpen(open);
  };

  const commonProps = {
    open,
    onOpenChange,
  };

  const triggerButton = (
    <Button variant="outline" disabled={disabled}>
      Add expense
    </Button>
  );

  if (isSmallDevice) {
    return (
      <Sheet {...commonProps}>
        <SheetTrigger asChild>{triggerButton}</SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Add Expense</SheetTitle>
          </SheetHeader>
          <ExpenseFormWrapper onClose={onOpenChange} expense={expense} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog {...commonProps}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <ExpenseFormWrapper onClose={onOpenChange} expense={expense} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
