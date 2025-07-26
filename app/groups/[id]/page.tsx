'use client';

import { GroupDetail } from '@/components/Groups/GroupDetail';
import { CategoriesProvider } from '@/lib/contexts/CategoriesContext';

export default async function Dashboard({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return (
    <CategoriesProvider>
      <GroupDetail id={id} />
    </CategoriesProvider>
  );
}
