import { useExpensesStore } from '@/lib/stores/expenses';
import { useMembersStore } from '@/lib/stores/members';
import { Expense } from '@/lib/types';

function calculateSplitDetails(expenses: Expense[]) {
  const splitDetails = expenses.reduce((acc, expense) => {
    expense.participants.forEach((participant) => {
      if (expense.handledBy?.id === participant.id) {
        return;
      }
      const handledById = expense.handledBy?.id!;
      acc[participant.id] = {
        ...acc[participant.id],
        [handledById]:
          (acc[participant.id]?.[handledById] || 0) +
          Number(expense.amount) / expense.participants.length,
      };
    });
    return acc;
  }, {} as Record<string, Record<string, number>>);

  Object.entries(splitDetails).forEach(([participantId, details]) => {
    Object.keys(details).forEach((payer) => {
      if (splitDetails[payer]?.[participantId] !== undefined) {
        const amount = Math.min(
          splitDetails[participantId][payer],
          splitDetails[payer][participantId]
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

export function ExpenseSplit() {
  const expenses = useExpensesStore((state) => state.items);
  const members = useMembersStore((state) => state.members);
  const splitDetails = calculateSplitDetails(expenses);
  return (
    <div className="w-full py-4">
      <strong>Split:</strong>{' '}
      {splitDetails &&
        Object.entries(splitDetails).map(([participantId, details]) => {
          const participant = members.find((m) => m.id === participantId);
          return Object.entries(details).map(([payerId, amount]) => {
            const payer = members.find((m) => m.id === payerId);
            return (
              <div key={payerId}>
                {participant?.name} {'=>'} {payer?.name}{' '}
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(amount)}
              </div>
            );
          });
        })}
    </div>
  );
}
