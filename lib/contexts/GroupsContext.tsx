"use client";

import type { Group } from "@/lib/types";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import type React from "react";
import { createContext, useContext, useMemo } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

type GroupsContextType = {
  groups: Group[];
  currentGroup?: Group;
  loading: boolean;
  addGroup: (
    group: { name: string },
    profileId: string,
  ) => Promise<string | null>;
};

const GroupsContext = createContext<GroupsContextType | undefined>(undefined);

export const GroupsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const params = useParams();
  const groupId = params?.id as Id<"groups"> | undefined;

  const groups = useQuery(api.groups.list);
  const currentGroupQuery = useQuery(
    api.groups.get,
    groupId ? { id: groupId } : "skip",
  );
  const createGroup = useMutation(api.groups.create);

  const loading = groups === undefined;

  const addGroup = async (
    group: { name: string },
    profileId: string, // Unused in new impl but kept for signature compatibility if possible, or remove.
  ) => {
    // profileId is handled by auth now.
    const newGroupId = await createGroup({ name: group.name });
    return newGroupId;
  };

  const currentGroup = currentGroupQuery || undefined;

  // Adapt Convex return type to App type
  const adaptedGroups = useMemo(() => {
    return (groups || []).map((g) => ({
      ...g,
      // Map legacy field if needed, but we should prefer _id
      id: g._id,
    }));
  }, [groups]);

  const adaptedCurrentGroup = useMemo(() => {
    if (!currentGroup) return undefined;
    return {
      ...currentGroup,
      id: currentGroup._id,
    };
  }, [currentGroup]);

  return (
    <GroupsContext.Provider
      value={{
        groups: adaptedGroups,
        currentGroup: adaptedCurrentGroup,
        loading,
        addGroup,
      }}
    >
      {children}
    </GroupsContext.Provider>
  );
};

export const useGroups = () => {
  const ctx = useContext(GroupsContext);
  if (!ctx) throw new Error("useGroups must be used within a GroupsProvider");
  return ctx;
};
