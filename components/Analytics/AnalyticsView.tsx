"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExpensesStore } from "@/lib/contexts/ExpensesContext";
import { useMembers } from "@/lib/contexts/MembersContext";
import { formatCurrency } from "@/lib/utils";
import { useMemo } from "react";
import {
    Bar,
    BarChart,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
];

export function AnalyticsView() {
    const { items: expenses } = useExpensesStore();
    const { members } = useMembers();

    const categoryData = useMemo(() => {
        const totals: Record<string, number> = {};
        for (const expense of expenses) {
            const categoryName = expense.category?.name || "Uncategorized";
            const amount = Number.parseFloat(expense.amount);
            if (!Number.isNaN(amount)) {
                totals[categoryName] = (totals[categoryName] || 0) + amount;
            }
        }
        return Object.entries(totals)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [expenses]);

    const memberData = useMemo(() => {
        const totals: Record<string, number> = {};
        // Initialize all members with 0
        for (const member of members) {
            totals[member.name] = 0;
        }

        for (const expense of expenses) {
            const payerName = expense.handledBy?.name;
            const amount = Number.parseFloat(expense.amount);
            if (payerName && !Number.isNaN(amount)) {
                totals[payerName] = (totals[payerName] || 0) + amount;
            }
        }

        return Object.entries(totals)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [expenses, members]);

    const totalSpending = useMemo(() => {
        return expenses.reduce((acc, curr) => {
            const amount = Number.parseFloat(curr.amount);
            return acc + (Number.isNaN(amount) ? 0 : amount);
        }, 0);
    }, [expenses]);

    const averageExpense = useMemo(() => {
        return expenses.length > 0 ? totalSpending / expenses.length : 0;
    }, [totalSpending, expenses.length]);

    const highestExpense = useMemo(() => {
        if (expenses.length === 0) return null;
        return expenses.reduce((prev, current) => {
            const prevAmount = Number.parseFloat(prev.amount) || 0;
            const currentAmount = Number.parseFloat(current.amount) || 0;
            return prevAmount > currentAmount ? prev : current;
        });
    }, [expenses]);

    const topCategory = useMemo(() => {
        if (categoryData.length === 0) return null;
        return categoryData[0];
    }, [categoryData]);

    if (expenses.length === 0) {
        return (
            <div className="text-center text-muted-foreground py-12">
                No expenses to analyze yet.
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid gap-4 grid-cols-1">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Spending
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div
                            className="text-2xl font-bold truncate"
                            title={formatCurrency(totalSpending)}
                        >
                            {formatCurrency(totalSpending)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Expenses
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{expenses.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Average Expense
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div
                            className="text-2xl font-bold truncate"
                            title={formatCurrency(averageExpense)}
                        >
                            {formatCurrency(averageExpense)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Highest Expense
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div
                            className="text-2xl font-bold truncate"
                            title={
                                highestExpense
                                    ? formatCurrency(Number.parseFloat(highestExpense.amount))
                                    : formatCurrency(0)
                            }
                        >
                            {highestExpense
                                ? formatCurrency(Number.parseFloat(highestExpense.amount))
                                : formatCurrency(0)}
                        </div>
                        <p
                            className="text-xs text-muted-foreground truncate"
                            title={highestExpense?.name || "-"}
                        >
                            {highestExpense?.name || "-"}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Top Category
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div
                            className="text-2xl font-bold truncate"
                            title={topCategory?.name || "-"}
                        >
                            {topCategory?.name || "-"}
                        </div>
                        <p
                            className="text-xs text-muted-foreground truncate"
                            title={
                                topCategory
                                    ? formatCurrency(topCategory.value)
                                    : formatCurrency(0)
                            }
                        >
                            {topCategory
                                ? formatCurrency(topCategory.value)
                                : formatCurrency(0)}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 grid-cols-1">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Spending by Category</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) =>
                                            `${name} ${((percent || 0) * 100).toFixed(0)}%`
                                        }
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: number) => [formatCurrency(value), "Amount"]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Spending by Member</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={memberData}>
                                    <XAxis
                                        dataKey="name"
                                        stroke="var(--muted-foreground)"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="var(--muted-foreground)"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => {
                                            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                                            if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                                            return value;
                                        }}
                                        width={80}
                                    />
                                    <Tooltip
                                        cursor={{ fill: "transparent" }}
                                        contentStyle={{
                                            backgroundColor: "var(--popover)",
                                            borderColor: "var(--border)",
                                            color: "var(--popover-foreground)",
                                        }}
                                        formatter={(value: number) => [formatCurrency(value), "Amount"]}
                                    />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
