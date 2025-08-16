"use client";

import { GroupDetail } from "@/components/Groups/GroupDetail";
import { CategoriesProvider } from "@/lib/contexts/CategoriesContext";
import { ExpensesProvider } from "@/lib/contexts/ExpensesContext";
import { GroupsProvider } from "@/lib/contexts/GroupsContext";

export default async function Dashboard({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return (
    <GroupsProvider groupId={id}>
      <CategoriesProvider>
        <ExpensesProvider>
          <GroupDetail />
        </ExpensesProvider>
      </CategoriesProvider>
    </GroupsProvider>
  );
}
