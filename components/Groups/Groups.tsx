"use client";

import { format } from "date-fns";
import Link from "next/link";

import { useGroups } from "@/lib/contexts/GroupsContext";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ComponentLoading } from "../ui/component-loading";
import { CreateGroup } from "./CreateGroup";

export function Groups() {
  const { groups, loading } = useGroups();

  return (
    <div>
      {/* Create Group Section */}
      <div className="my-3">
        <CreateGroup />
      </div>

      {/* Groups List */}
      <ComponentLoading
        isLoading={loading}
        loadingMessage="Loading your groups..."
      >
        <div className="grid grid-cols-1 gap-3">
          {groups.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No groups found. Create your first group to get started!
            </div>
          ) : (
            groups.map((item) => (
              <Link key={item._id} href={`/groups/${item._id}`}>
                <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold truncate">
                      {item.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      {item._creationTime
                        ? format(new Date(item._creationTime), "PP")
                        : "Unknown date"}
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
