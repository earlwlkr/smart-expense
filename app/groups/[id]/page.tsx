import { GroupDetail } from '@/components/GroupDetail';

export default async function Dashboard({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return <GroupDetail id={id} />;
}
