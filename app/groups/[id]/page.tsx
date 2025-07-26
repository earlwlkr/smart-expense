'use client';

import { GroupDetail } from '@/components/Groups/GroupDetail';
import { CategoriesProvider } from '@/lib/contexts/CategoriesContext';
import { ExpensesProvider } from '@/lib/contexts/ExpensesContext';

export default async function Dashboard({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return (
    <CategoriesProvider>
      <ExpensesProvider>
        <GroupDetail id={id} />
      </ExpensesProvider>
    </CategoriesProvider>
  );
}
