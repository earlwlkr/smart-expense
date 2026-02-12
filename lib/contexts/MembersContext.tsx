"use client";

import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { createContext, useContext, useMemo } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import type { Member } from "../types";

type MembersContextType = {
  members: Member[];
  loading: boolean;
  addMember: (
    name: string,
    groupId: string,
    profileId?: string,
  ) => Promise<void>;
  removeMember: (id: string) => Promise<void>;
};

const MembersContext = createContext<MembersContextType | undefined>(undefined);

export const MembersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const params = useParams();
  const groupId = params?.id as Id<"groups"> | undefined;

  const members = useQuery(api.members.list, groupId ? { groupId } : "skip");
  const createMember = useMutation(api.members.create);
  const deleteMember = useMutation(api.members.remove);

  const loading = members === undefined;

  const addMember = async (
    name: string,
    targetGroupId: string,
    profileId?: string,
  ) => {
    await createMember({
      name,
      groupId: targetGroupId as Id<"groups">,
      profileId: profileId as Id<"users">, // Cast might be unsafe if profileId is string
    });
  };

  const removeMember = async (id: string) => {
    await deleteMember({ id: id as Id<"members"> });
  };

  const adaptedMembers = useMemo(() => {
    return (members || []).map((m) => ({
      id: m._id,
      name: m.name,
    }));
  }, [members]);

  return (
    <MembersContext.Provider
      value={{
        members: adaptedMembers,
        loading,
        addMember,
        removeMember,
      }}
    >
      {children}
    </MembersContext.Provider>
  );
};

export const useMembers = () => {
  const ctx = useContext(MembersContext);
  if (!ctx) throw new Error("useMembers must be used within a MembersProvider");
  return ctx;
};
