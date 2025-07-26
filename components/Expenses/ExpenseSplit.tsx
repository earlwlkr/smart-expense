import { useMembersStore } from '@/lib/stores/members';
import { Expense } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useExpensesStore } from '@/lib/contexts/ExpensesContext';

function calculateSplitDetails(expenses: Expense[]) {
  const splitDetails = expenses.reduce((acc, expense) => {
    expense.participants.forEach((participant) => {
      if (!expense.handledBy?.id || expense.handledBy?.id === participant.id) {
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
  const { items: expenses } = useExpensesStore();
  const members = useMembersStore((state) => state.members);
  const splitDetails = calculateSplitDetails(expenses);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {splitDetails &&
          Object.entries(splitDetails).map(([participantId, details]) => {
            const participant = members.find((m) => m.id === participantId);
            return Object.entries(details).map(([payerId, amount]) => {
              const payer = members.find((m) => m.id === payerId);
              return (
                <TableRow key={`${participantId}-${payerId}`}>
                  <TableCell className="font-medium">
                    {participant?.name}
                  </TableCell>
                  <TableCell>{payer?.name}</TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(amount)}
                  </TableCell>
                </TableRow>
              );
            });
          })}
      </TableBody>
    </Table>
  );
}
