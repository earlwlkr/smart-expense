'use client';

import * as React from 'react';

import { useMembersStore } from '@/lib/stores/members';

export function Members() {
  const members = useMembersStore((state) => state.members);

  return (
    <>
      {members.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </>
  );
}
