'use client';

import { useCallback, useEffect, useState } from 'react';

import Link from 'next/link';
import { getGroups } from '@/lib/db/groups';
import { CreateGroup } from './CreateGroup';
import { Group } from '@/lib/types';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { format } from 'date-fns';

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
        <CreateGroup fetchData={fetchData} />
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
                  Created on: {format(new Date(item.created_at), 'PP')}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
