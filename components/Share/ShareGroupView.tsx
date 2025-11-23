import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Expense, Member } from "@/lib/types";
import { calculateSplitDetails } from "@/lib/utils/expenseSplit";
import { format } from "date-fns";
import { Fragment } from "react";

type ShareGroupViewProps = {
  groupName: string;
  expenses: Expense[];
  members: Member[];
};

export function ShareGroupView({
  groupName,
  expenses,
  members,
}: ShareGroupViewProps) {
  const totalAmount = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );

  const splitDetails = calculateSplitDetails(expenses);
  const splitGroups = Object.entries(splitDetails)
    .map(([fromId, details]) => {
      const fromMember = members.find((member) => member.id === fromId);
      const items = Object.entries(details)
        .filter(([, amount]) => amount > 0)
        .map(([toId, amount]) => {
          const toMember = members.find((member) => member.id === toId);
          return {
            id: `${fromId}-${toId}`,
            to: toMember?.name || "",
            amount,
          };
        });

      return {
        id: fromId,
        from: fromMember?.name || "",
        items,
      };
    })
    .filter((group) => group.items.length > 0);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10">
      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold">{groupName}</h1>
        <p className="text-muted-foreground">
          Shared read-only view of the latest expenses and balances for this
          group.
        </p>
        <p className="text-sm text-muted-foreground">
          Total expenses:{" "}
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(totalAmount)}
        </p>
      </header>

      <Tabs defaultValue="expenses" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="split">Split</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="mt-6 space-y-3">
          <div>
            <h2 className="text-xl font-semibold">Expenses</h2>
            <p className="text-sm text-muted-foreground">
              Listed chronologically with participants and payees.
            </p>
          </div>
          <div className="divide-y rounded-md border">
            {expenses.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">
                There are no expenses in this group yet.
              </p>
            ) : (
              expenses.map((expense) => (
                <div key={expense.id} className="flex flex-col gap-2 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-medium">{expense.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(expense.date), "PP")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(Number(expense.amount))}
                      </p>
                      {expense.category?.name ? (
                        <p className="text-sm text-muted-foreground">
                          {expense.category.name}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <p>
                      With:{" "}
                      {expense.participants
                        .map((participant) => participant.name)
                        .sort((a, b) => a.localeCompare(b))
                        .join(", ")}
                    </p>
                    <p>Paid by: {expense.handledBy?.name || "Not specified"}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="split" className="mt-6 space-y-3">
          <div>
            <h2 className="text-xl font-semibold">Balance summary</h2>
            <p className="text-sm text-muted-foreground">
              How much each member owes or is owed after netting shared
              expenses.
            </p>
          </div>
          {splitGroups.length === 0 ? (
            <p className="rounded-md border p-6 text-center text-sm text-muted-foreground">
              Everyone is settled up. No outstanding balances!
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {splitGroups.map((group) => (
                  <Fragment key={group.id}>
                    {group.items.map((item, index) => (
                      <TableRow key={item.id}>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
