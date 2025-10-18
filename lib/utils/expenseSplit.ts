import type { Expense } from '@/lib/types';

export type SplitDetails = Record<string, Record<string, number>>;

const EPSILON = 0.01;

type Balance = {
  id: string;
  amount: number;
};

export function calculateSplitDetails(expenses: Expense[]): SplitDetails {
  const balances = expenses.reduce<Record<string, number>>((acc, expense) => {
    const handledById = expense.handledBy?.id;
    if (!handledById || !expense.participants.length) {
      return acc;
    }

    const totalAmount = Number(expense.amount);
    const share = totalAmount / expense.participants.length;

    expense.participants.forEach((participant) => {
      acc[participant.id] = (acc[participant.id] || 0) - share;
    });

    acc[handledById] = (acc[handledById] || 0) + totalAmount;

    return acc;
  }, {});

  const debtors: Balance[] = [];
  const creditors: Balance[] = [];

  Object.entries(balances).forEach(([id, amount]) => {
    if (amount > EPSILON) {
      creditors.push({ id, amount });
    } else if (amount < -EPSILON) {
      debtors.push({ id, amount: -amount });
    }
  });

  const splitDetails: SplitDetails = {};

  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];

    const amount = Math.min(debtor.amount, creditor.amount);
    if (amount < EPSILON) {
      debtor.amount = 0;
      debtorIndex += 1;
      continue;
    }

    const roundedAmount = Math.floor(amount * 100) / 100;

    if (roundedAmount < EPSILON) {
      debtor.amount = 0;
      debtorIndex += 1;
      continue;
    }

    splitDetails[debtor.id] = {
      ...splitDetails[debtor.id],
      [creditor.id]: (splitDetails[debtor.id]?.[creditor.id] || 0) + roundedAmount,
    };

    debtor.amount = Math.max(0, parseFloat((debtor.amount - roundedAmount).toFixed(10)));
    creditor.amount = Math.max(
      0,
      parseFloat((creditor.amount - roundedAmount).toFixed(10)),
    );

    if (debtor.amount <= EPSILON) {
      debtor.amount = 0;
      debtorIndex += 1;
    }

    if (creditor.amount <= EPSILON) {
      creditor.amount = 0;
      creditorIndex += 1;
    }
  }

  return splitDetails;
}
