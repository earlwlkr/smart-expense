import * as React from 'react';

import Link from 'next/link';
import { getGroups } from '@/lib/db/groups';

export async function Groups() {
  const data = await getGroups();

  return data.map((item) => (
    <Link key={item.id} href={`/groups/${item.id}`}>
      {item.name}
    </Link>
  ));
}
