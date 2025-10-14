import { Fragment, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useExpensesStore } from '@/lib/contexts/ExpensesContext';
import { useMembers } from '@/lib/contexts/MembersContext';
import { calculateSplitDetails } from '@/lib/utils/expenseSplit';

export function ExpenseSplit() {
  const { items: expenses } = useExpensesStore();
  const { members } = useMembers();
  const splitDetails = calculateSplitDetails(expenses);

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

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.map((group) => (
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
