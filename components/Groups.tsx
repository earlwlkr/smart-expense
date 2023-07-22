import * as React from 'react';

import Link from 'next/link';

export function Groups() {
  const data = [
    {
      id: 1,
      name: 'Da Lat Trip',
    },
  ];

  return data.map((item) => (
    <Link key={item.id} href={`/groups/${item.id}`}>
      {item.name}
    </Link>
  ));
}
