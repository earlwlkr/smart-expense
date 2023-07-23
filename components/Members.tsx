'use client';

import * as React from 'react';

import { useMembersStore } from '@/lib/stores/members';

export function Members() {
  const members = useMembersStore((state) => state.members);

  return (
    <p className="text-muted-foreground py-2">
      With
      {members.map((item, index) => (
        <span key={item.id} className="pl-1">
          {item.name}
          {index < members.length - 1 ? ',' : ''}
        </span>
      ))}
    </p>
  );
}
