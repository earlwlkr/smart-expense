'use client';

import { useCallback, useEffect, useState } from 'react';

import Link from 'next/link';
import { getGroups } from '@/lib/db/groups';
import { CreateGroup } from './CreateGroup';
import { Group } from '@/lib/types';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';

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
    <div>
      <CreateGroup fetchData={fetchData} />
      <div className="space-x-4 mt-4">
        {groups.map((item) => (
          <Link key={item.id} href={`/groups/${item.id}`}>
            <Card className="inline-flex">
              <CardHeader>
                <CardTitle className="pb-2 w-80 truncate whitespace-nowrap">
                  {item.name}
                </CardTitle>
                <CardDescription>
                  {new Date(item.created_at).toDateString()}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
