import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useExpensesStore } from "@/lib/contexts/ExpensesContext";
import { useMembers } from "@/lib/contexts/MembersContext";
import { calculateSplitDetails } from "@/lib/utils/expenseSplit";
import { ArrowUpDown, Users } from "lucide-react";
import { Fragment, useMemo, useState } from "react";

type GroupBy = "debtor" | "creditor";
type SortOption = "name-asc" | "name-desc" | "amount-desc" | "amount-asc";

export function ExpenseSplit() {
  const { items: expenses } = useExpensesStore();
  const { members } = useMembers();
  const [groupBy, setGroupBy] = useState<GroupBy>("debtor");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const splitDetails = calculateSplitDetails(expenses);

  const groups = useMemo(() => {
    let groupArray: Array<{
      id: string;
      groupName: string;
      items: Array<{ key: string; counterparty: string; amount: number }>;
      totalAmount: number;
    }> = [];

    if (groupBy === "debtor") {
      // Group by debtor (who owes money)
      groupArray = Object.entries(splitDetails).map(([fromId, details]) => {
        const fromMember = members.find((m) => m.id === fromId);
        const items = Object.entries(details).map(([toId, amount]) => {
          const toMember = members.find((m) => m.id === toId);
          return {
            key: `${fromId}-${toId}`,
            counterparty: toMember?.name || "",
            amount,
          };
        });

        // Sort items within each group by amount (descending by default)
        items.sort((a, b) => b.amount - a.amount);

        return {
          id: fromId,
          groupName: fromMember?.name || "",
          items,
          totalAmount: items.reduce((sum, item) => sum + item.amount, 0),
        };
      });
    } else {
      // Group by creditor (who is owed money)
      const creditorMap = new Map<
        string,
        Array<{ key: string; counterparty: string; amount: number }>
      >();

      // Invert the split details to group by creditor
      for (const [fromId, details] of Object.entries(splitDetails)) {
        const fromMember = members.find((m) => m.id === fromId);
        for (const [toId, amount] of Object.entries(details)) {
          if (!creditorMap.has(toId)) {
            creditorMap.set(toId, []);
          }
          creditorMap.get(toId)?.push({
            key: `${fromId}-${toId}`,
            counterparty: fromMember?.name || "",
            amount,
          });
        }
      }

      // Convert map to array format
      groupArray = Array.from(creditorMap.entries()).map(
        ([creditorId, items]) => {
          const creditorMember = members.find((m) => m.id === creditorId);
          // Sort items within each group by amount (descending)
          items.sort((a, b) => b.amount - a.amount);
          return {
            id: creditorId,
            groupName: creditorMember?.name || "",
            items,
            totalAmount: items.reduce((sum, item) => sum + item.amount, 0),
          };
        },
      );
    }

    // Sort groups
    groupArray.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.groupName.localeCompare(b.groupName);
        case "name-desc":
          return b.groupName.localeCompare(a.groupName);
        case "amount-desc":
          return b.totalAmount - a.totalAmount;
        case "amount-asc":
          return a.totalAmount - b.totalAmount;
        default:
          return 0;
      }
    });

    return groupArray;
  }, [splitDetails, members, groupBy, sortBy]);

  const totalOwed = useMemo(() => {
    return groups.reduce((sum, group) => sum + group.totalAmount, 0);
  }, [groups]);

  return (
    <div className="pb-4">
      {/* Group By and Sort Controls */}
      <div className="mt-4 mb-3 flex flex-nowrap items-center gap-2 overflow-x-auto pb-1">
        <Select
          value={groupBy}
          onValueChange={(val) => setGroupBy(val as GroupBy)}
        >
          <SelectTrigger className="w-[130px] h-8 text-xs">
            <div className="flex items-center gap-2 truncate">
              <Users className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
              <span className="truncate">
                {groupBy === "debtor" ? "Debtor (Owes)" : "Creditor (Owed)"}
              </span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="debtor">Debtor (Owes)</SelectItem>
              <SelectItem value="creditor">Creditor (Owed)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(val) => setSortBy(val as SortOption)}
        >
          <SelectTrigger className="w-[130px] h-8 text-xs">
            <div className="flex items-center gap-2 truncate">
              <ArrowUpDown className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
              <span className="truncate">
                {sortBy === "name-asc" && "Name (A-Z)"}
                {sortBy === "name-desc" && "Name (Z-A)"}
                {sortBy === "amount-desc" && "Amount (High)"}
                {sortBy === "amount-asc" && "Amount (Low)"}
              </span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="amount-desc">Amount (High)</SelectItem>
              <SelectItem value="amount-asc">Amount (Low)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="ml-auto text-sm flex-shrink-0 whitespace-nowrap">
          <strong>Total:</strong>{" "}
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(totalOwed)}
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground border rounded-md">
          No splits to show. Add expenses to see who owes what.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                {groupBy === "debtor" ? "Debtor (Owes)" : "Creditor (Owed)"}
              </TableHead>
              <TableHead>{groupBy === "debtor" ? "To" : "From"}</TableHead>
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
                        {group.groupName}
                      </TableCell>
                    )}
                    <TableCell>{item.counterparty}</TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
