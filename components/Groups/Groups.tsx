'use client';

import { format } from 'date-fns';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { getGroups } from '@/lib/db/groups';
import type { Group } from '@/lib/types';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ComponentLoading } from '../ui/component-loading';
import { CreateGroup } from './CreateGroup';

export function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getGroups();
      setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setIsLoading(false);
    }
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
      <ComponentLoading
        isLoading={isLoading}
        loadingMessage="Loading your groups..."
      >
        <div className="grid grid-cols-1 gap-3">
          {groups.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No groups found. Create your first group to get started!
            </div>
          ) : (
            groups.map((item) => (
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
            ))
          )}
        </div>
      </ComponentLoading>
    </div>
  );
}
