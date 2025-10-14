import type { Expense } from '@/lib/types';

export type SplitDetails = Record<string, Record<string, number>>;

export function calculateSplitDetails(expenses: Expense[]): SplitDetails {
  const splitDetails = expenses.reduce<SplitDetails>((acc, expense) => {
    expense.participants.forEach((participant) => {
      if (!expense.handledBy?.id || expense.handledBy?.id === participant.id) {
        return;
      }
      const handledById = expense.handledBy?.id;
      if (!handledById) return;

      acc[participant.id] = {
        ...acc[participant.id],
        [handledById]:
          (acc[participant.id]?.[handledById] || 0) +
          Number(expense.amount) / expense.participants.length,
      };
    });
    return acc;
  }, {});

  Object.entries(splitDetails).forEach(([participantId, details]) => {
    Object.keys(details).forEach((payer) => {
      if (splitDetails[payer]?.[participantId] !== undefined) {
        const amount = Math.min(
          splitDetails[participantId][payer],
          splitDetails[payer][participantId],
        );

        splitDetails[participantId][payer] -= amount;
        if (splitDetails[participantId][payer] === 0) {
          delete splitDetails[participantId][payer];
        }

        splitDetails[payer][participantId] -= amount;
        if (splitDetails[payer][participantId] === 0) {
          delete splitDetails[payer][participantId];
        }
      }
    });
  });

  return splitDetails;
}
