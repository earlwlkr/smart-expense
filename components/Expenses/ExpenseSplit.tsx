import { useMembers } from '@/lib/contexts/MembersContext';
import { useExpensesStore } from '@/lib/contexts/ExpensesContext';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Fragment, useMemo, useState } from 'react';

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
  const { members } = useMembers();
  const splitDetails = calculateSplitDetails(expenses);
  const [filter, setFilter] = useState('all');

  const groups = useMemo(() => {
    return Object.entries(splitDetails).map(([fromId, details]) => {
      const fromMember = members.find((m) => m.id === fromId);
      const items = Object.entries(details).map(([toId, amount]) => {
        const toMember = members.find((m) => m.id === toId);
        return {
          key: `${fromId}-${toId}`,
          to: toMember?.name || '',
          amount,
        };
      });
      return {
        id: fromId,
        from: fromMember?.name || '',
        items,
      };
    });
  }, [splitDetails, members]);

  const filteredGroups = useMemo(() => {
    if (filter === 'all') return groups;
    return groups.filter((group) => group.id === filter);
  }, [groups, filter]);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Select onValueChange={setFilter} value={filter}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filter by participant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All participants</SelectItem>
            {groups.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                {group.from}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredGroups.map((group) => (
            <Fragment key={group.id}>
              {group.items.map((item, index) => (
                <TableRow key={item.key}>
                  {index === 0 && (
                    <TableCell
                      rowSpan={group.items.length}
                      className="font-medium"
                    >
                      {group.from}
                    </TableCell>
                  )}
                  <TableCell>{item.to}</TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(item.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
