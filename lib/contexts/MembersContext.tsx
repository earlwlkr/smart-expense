import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";
import type { Member } from "../types";

type MembersContextType = {
  members: Member[];
  updateMembers: (members: Member[]) => void;
};

const MembersContext = createContext<MembersContextType | undefined>(undefined);

export const MembersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [members, setMembers] = useState<Member[]>([]);

  const updateMembers = useCallback((newMembers: Member[]) => {
    setMembers(newMembers);
  }, []);

  return (
    <MembersContext.Provider value={{ members, updateMembers }}>
      {children}
    </MembersContext.Provider>
  );
};

export const useMembers = () => {
  const ctx = useContext(MembersContext);
  if (!ctx) throw new Error("useMembers must be used within a MembersProvider");
  return ctx;
};
