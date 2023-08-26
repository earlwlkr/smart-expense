'use client';

import { useCallback, useEffect, useState } from 'react';

import Link from 'next/link';
import { getGroups } from '@/lib/db/groups';
import { CreateGroup } from './CreateGroup';
import { Group } from '@/lib/types';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import format from 'date-fns/format';

export function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);

  const fetchData = useCallback(async () => {
    const data = await getGroups();
    setGroups(data);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="container">
      <CreateGroup fetchData={fetchData} />
      <div className="flex flex-col space-x-0 lg:flex-row lg:space-x-4">
        {groups.map((item) => (
          <Link key={item.id} href={`/groups/${item.id}`}>
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="pb-2 w-80 truncate whitespace-nowrap">
                  {item.name}
                </CardTitle>
                <CardDescription>
                  {format(new Date(item.created_at), 'PP')}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
