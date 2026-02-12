"use client";

import { AddExpenseButton } from "@/components/AddExpenseButton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/lib/contexts/CategoriesContext";
import { useExpensesStore } from "@/lib/contexts/ExpensesContext";
import { useMembers } from "@/lib/contexts/MembersContext";
import type { Expense } from "@/lib/types";
import { format } from "date-fns";
import { ArrowUpDown, Filter, X } from "lucide-react";
import * as React from "react";
import { useMemo, useState } from "react";
import { Button } from "../ui/button";

type SortOption = "date-desc" | "date-asc" | "amount-desc" | "amount-asc";

export function Expenses() {
  const { items: expenses } = useExpensesStore();
  const { categories } = useCategories();
  const { members } = useMembers();
  const [open, setOpen] = useState(false);
  const [expense, setExpense] = useState<Expense | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterMember, setFilterMember] = useState<string>("all");

  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = [...expenses];

    // Apply filters
    if (filterCategory !== "all") {
      filtered = filtered.filter(
        (expense) => expense.category?._id === filterCategory,
      );
    }
    if (filterMember !== "all") {
      filtered = filtered.filter(
        (expense) => expense.handledBy?._id === filterMember,
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "amount-desc":
          return Number(b.amount) - Number(a.amount);
        case "amount-asc":
          return Number(a.amount) - Number(b.amount);
        default:
          return 0;
      }
    });

    return filtered;
  }, [expenses, filterCategory, filterMember, sortBy]);

  const hasActiveFilters = filterCategory !== "all" || filterMember !== "all";

  const clearFilters = () => {
    setFilterCategory("all");
    setFilterMember("all");
  };

  return (
    <div className="flex flex-col w-full pb-4">
      <div className="mt-4 mb-2 flex justify-between items-end">
        <AddExpenseButton
          open={open}
          setOpen={setOpen}
          expense={expense}
          setExpense={setExpense}
        />
        <div>
          <strong>Total:</strong>{" "}
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(
            filteredAndSortedExpenses.reduce((sum, item) => {
              return sum + Number(item.amount);
            }, 0),
          )}
        </div>
      </div>

      {/* Filter and Sort Controls */}
      <div className="mb-3 flex flex-nowrap gap-2 items-center overflow-x-auto pb-1">
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[130px] h-8 text-xs">
            <div className="flex items-center gap-2 truncate">
              <Filter className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
              <span className="truncate">
                {filterCategory === "all"
                  ? "Category"
                  : categories.find((c) => c._id === filterCategory)?.name}
              </span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={filterMember} onValueChange={setFilterMember}>
          <SelectTrigger className="w-[130px] h-8 text-xs">
            <SelectValue placeholder="Paid by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Members</SelectItem>
              {members.map((member) => (
                <SelectItem key={member._id} value={member._id}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 px-2 text-xs"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Clear
          </Button>
        )}

        <div className="ml-auto flex-shrink-0">
          <Select
            value={sortBy}
            onValueChange={(val) => setSortBy(val as SortOption)}
          >
            <SelectTrigger className="w-[130px] h-8 text-xs">
              <div className="flex items-center gap-2 truncate">
                <ArrowUpDown className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                <span className="truncate">
                  {sortBy === "date-desc" && "Date (Newest)"}
                  {sortBy === "date-asc" && "Date (Oldest)"}
                  {sortBy === "amount-desc" && "Amount (High)"}
                  {sortBy === "amount-asc" && "Amount (Low)"}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="date-desc">Date (Newest)</SelectItem>
                <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                <SelectItem value="amount-desc">Amount (High)</SelectItem>
                <SelectItem value="amount-asc">Amount (Low)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        {filteredAndSortedExpenses.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            {hasActiveFilters
              ? "No expenses match the selected filters"
              : "No expenses yet"}
          </div>
        ) : (
          filteredAndSortedExpenses.map((expense) => (
            <div
              key={expense._id}
              className="p-4 border-b cursor-pointer hover:bg-accent/50"
              onClick={() => {
                setExpense(expense);
                setOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setExpense(expense);
                  setOpen(true);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-medium">{expense.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(expense.date), "PP")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-medium">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(Number(expense.amount))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {expense.category?.name}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                <div>
                  With:{" "}
                  {expense.participants
                    .sort((memberA, memberB) =>
                      memberA.name.localeCompare(memberB.name),
                    )
                    .map((p) => p.name)
                    .join(", ")}
                </div>
                <div>By: {expense.handledBy?.name}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
