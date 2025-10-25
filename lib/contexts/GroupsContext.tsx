'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import { Group } from "@/lib/types";
import * as db from "@/lib/db/groups";

type GroupsContextType = {
  groups: Group[];
  currentGroup: Group | null;
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
  const [currentGroup, setCurrentGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const data = await db.getGroups();
      setGroups(data);
    } catch (error) {
      console.error("Failed to load groups", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getGroupDetail = useCallback(async (groupId: string) => {
    setLoading(true);
    try {
      const detail = await db.getGroupDetail(groupId);
      setCurrentGroup(detail);
      return detail || null;
    } catch (error) {
      console.error("Failed to load group", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addGroup = useCallback(
    async (group: Omit<Group, "id" | "created_at">, profileId: string) => {
      setLoading(true);
      try {
        const newGroup = await db.addGroup(group, profileId);
        if (newGroup) setGroups((prev) => [...prev, newGroup]);
        return newGroup;
      } catch (error) {
        console.error("Failed to create group", error);
        return null;
      } finally {
        setLoading(false);
      }
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
