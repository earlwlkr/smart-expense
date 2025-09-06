'use client';

import { format } from 'date-fns';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { getGroups } from '@/lib/db/groups';
import type { Group } from '@/lib/types';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { CreateGroup } from './CreateGroup';

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
      {/* Create Group Section */}
      <div className="my-3">
        <CreateGroup />
      </div>

      {/* Groups List */}
      <div className="grid grid-cols-1 gap-3">
        {groups.map((item) => (
          <Link key={item.id} href={`/groups/${item.id}`}>
            <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg font-semibold truncate">
                  {item.name}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
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
