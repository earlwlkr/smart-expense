import * as React from 'react';

import Link from 'next/link';
import { getGroups } from '@/lib/db/groups';
import { CreateGroup } from './CreateGroup';

export async function Groups() {
  const data = await getGroups();

  return (
    <ul>
      {data.map((item) => (
        <Link key={item.id} href={`/groups/${item.id}`}>
          <li>{item.name}</li>
        </Link>
      ))}
      <li>
        <CreateGroup />
      </li>
    </ul>
  );
}
