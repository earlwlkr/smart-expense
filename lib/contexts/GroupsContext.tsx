'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Group } from "@/lib/types";
import * as db from "@/lib/db/groups";

type GroupsContextType = {
  groups: Group[];
  currentGroup?: Group;
  loading: boolean;
  fetchGroups: () => Promise<void>;
  getGroupDetail: (groupId: string) => Promise<Group | null>;
  addGroup: (
    group: Omit<Group, "id" | "created_at">,
    profileId: string
  ) => Promise<Group | null>;
};

const GroupsContext = createContext<GroupsContextType | undefined>(undefined);

export const GroupsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [currentGroup, setCurrentGroup] = useState<Group>();
  const [loading, setLoading] = useState(false);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    const data = await db.getGroups();
    setGroups(data);
    setLoading(false);
  }, []);

  const getGroupDetail = useCallback(async (groupId: string) => {
    setLoading(true);
    const detail = await db.getGroupDetail(groupId);
    setLoading(false);
    setCurrentGroup(detail);
    return detail || null;
  }, []);

  const addGroup = useCallback(
    async (group: Omit<Group, "id" | "created_at">, profileId: string) => {
      setLoading(true);
      const newGroup = await db.addGroup(group, profileId);
      if (newGroup) setGroups((prev) => [...prev, newGroup]);
      setLoading(false);
      return newGroup;
    },
    []
  );

  return (
    <GroupsContext.Provider
      value={{
        groups,
        currentGroup,
        loading,
        fetchGroups,
        getGroupDetail,
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
