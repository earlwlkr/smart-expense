"use client";

import { ShareGroupView } from "@/components/Share/ShareGroupView";
import type { Expense, Member } from "@/lib/types";
import { notFound, useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PageLoading } from "@/components/ui/page-loading";

export default function SharePage() {
  const params = useParams();
  const token = params.token as string;

  const publicData = useQuery(api.expenses.listPublic, { token });

  if (publicData === undefined) {
    return <PageLoading message="Loading shared group..." />;
  }

  if (publicData === null) {
    notFound();
    return null; // unreachable but for TS
  }

  const { groupName, members, expenses } = publicData;

  const adaptedExpenses: Expense[] = (expenses as any[]).map((expense) => ({
    _id: expense.id,
    _creationTime: expense._creationTime || 0,
    id: expense.id,
    name: expense.name,
    amount: Number.parseFloat(expense.amount),
    date: new Date(expense.date),
    category: expense.category ? {
      _id: expense.category._id,
      _creationTime: expense.category._creationTime || 0,
      id: expense.category._id,
      name: expense.category.name,
      groupId: expense.category.groupId
    } : undefined,
    handledBy: expense.handledBy ? {
      _id: expense.handledBy._id,
      _creationTime: expense.handledBy._creationTime || 0,
      id: expense.handledBy._id,
      name: expense.handledBy.name,
      groupId: expense.handledBy.groupId
    } : undefined,
    participants: (expense.participants as any[]).map(p => ({
      _id: p._id,
      _creationTime: p._creationTime || 0,
      id: p._id,
      name: p.name,
      groupId: p.groupId
    })),
  }));

  const adaptedMembers: Member[] = (members as any[]).map(m => ({
    id: m._id,
    name: m.name,
    groupId: m.groupId,
    _id: m._id,
    _creationTime: m._creationTime
  }));

  return (
    <ShareGroupView
      groupName={groupName}
      expenses={adaptedExpenses}
      members={adaptedMembers}
    />
  );
}
