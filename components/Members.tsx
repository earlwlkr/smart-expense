'use client';

import * as React from 'react';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function Members() {
  const data = [
    {
      id: 1,
      name: 'Mike',
    },
    {
      id: 2,
      name: 'Kallie',
    },
  ];

  return data.map((item) => <div key={item.id}>{item.name}</div>);
}
