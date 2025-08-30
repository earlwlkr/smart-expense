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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon } from 'lucide-react';
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
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

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
    const q = query.toLowerCase();
    return groups.filter((group) => group.from.toLowerCase().includes(q));
  }, [groups, query]);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(search);
        }}
        className="mb-4 flex justify-end gap-2"
      >
        <div className="relative w-64">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search participants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button type="submit" variant="secondary" size="icon">
          <SearchIcon className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </form>
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
