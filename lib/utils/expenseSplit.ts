import type { Expense } from "@/lib/types";

export type SplitDetails = Record<string, Record<string, number>>;

type Balance = {
  id: string;
  amount: number;
};

export function calculateSplitDetails(expenses: Expense[]): SplitDetails {
  const balances = expenses.reduce<Record<string, number>>((acc, expense) => {
    if (!expense.handledBy?.id) {
      return acc;
    }

    const share =
      expense.participants.length > 0
        ? Number(expense.amount) / expense.participants.length
        : 0;

    expense.participants.forEach((participant) => {
      acc[participant.id] = (acc[participant.id] || 0) - share;
    });

    acc[expense.handledBy.id] =
      (acc[expense.handledBy.id] || 0) + Number(expense.amount);

    return acc;
  }, {});

  const debtors: Balance[] = [];
  const creditors: Balance[] = [];

  Object.entries(balances).forEach(([id, amount]) => {
    const roundedAmount = Math.round(amount * 100) / 100;

    if (roundedAmount > 0) {
      creditors.push({ id, amount: roundedAmount });
    } else if (roundedAmount < 0) {
      debtors.push({ id, amount: Math.abs(roundedAmount) });
    }
  });

  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const splitDetails: SplitDetails = {};

  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    const amount = Math.min(debtor.amount, creditor.amount);

    if (!splitDetails[debtor.id]) {
      splitDetails[debtor.id] = {};
    }

    splitDetails[debtor.id][creditor.id] =
      (splitDetails[debtor.id][creditor.id] || 0) + amount;

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (Math.abs(debtor.amount) < 0.01) {
      debtorIndex += 1;
    }

    if (Math.abs(creditor.amount) < 0.01) {
      creditorIndex += 1;
    }
  }

  return splitDetails;
}
