import {
  disableInviteToken as disableInviteTokenDb,
  enableInviteToken as enableInviteTokenDb,
} from "@/lib/db/tokens";
import type { Token } from "@/lib/types";
import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";

type TokensContextType = {
  inviteToken: Token | null;
  setInviteToken: (token: Token | null) => void;
  enableInviteToken: (groupId: string) => Promise<void>;
  disableInviteToken: (groupId: string) => Promise<void>;
};

const TokensContext = createContext<TokensContextType | undefined>(undefined);

export const TokensProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [inviteToken, setInviteTokenState] = useState<Token | null>(null);

  const setInviteToken = useCallback((token: Token | null) => {
    setInviteTokenState(token);
  }, []);

  const enableInviteToken = useCallback(async (groupId: string) => {
    const token = await enableInviteTokenDb(groupId);
    setInviteTokenState(token);
  }, []);

  const disableInviteToken = useCallback(async (groupId: string) => {
    const token = await disableInviteTokenDb(groupId);
    setInviteTokenState(token);
  }, []);

  return (
    <TokensContext.Provider
      value={{
        inviteToken,
        setInviteToken,
        enableInviteToken,
        disableInviteToken,
      }}
    >
      {children}
    </TokensContext.Provider>
  );
};

export const useTokens = () => {
  const ctx = useContext(TokensContext);
  if (!ctx) throw new Error("useTokens must be used within a TokensProvider");
  return ctx;
};
