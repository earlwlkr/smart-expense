'use client';

import { format } from 'date-fns';

import Link from 'next/link';
import { useEffect } from 'react';
import { useGroups } from '@/lib/contexts/GroupsContext';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Icons } from '../ui/icons';
import { CreateGroup } from './CreateGroup';

export function Groups() {
  const { groups, fetchGroups, loading } = useGroups();

  useEffect(() => {
    void fetchGroups();
  }, [fetchGroups]);

  return (
    <div>
      {/* Create Group Section */}
      <div className="my-3">
        <CreateGroup />
      </div>

      {/* Groups List */}
      <div className="grid grid-cols-1 gap-3">
        {loading && (
          <div className="col-span-full flex items-center justify-center py-10 text-sm text-muted-foreground">
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            Loading groups...
          </div>
        )}
        {!loading && groups.length === 0 && (
          <div className="col-span-full rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
            No groups yet. Create one to get started.
          </div>
        )}
        {!loading &&
          groups.map((item) => (
            <Link key={item.id} href={`/groups/${item.id}`}>
              <Card className="cursor-pointer transition-shadow duration-200 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="truncate text-lg font-semibold">
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
