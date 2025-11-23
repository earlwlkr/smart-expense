import {
  disableShareToken as disableShareTokenDb,
  enableShareToken as enableShareTokenDb,
} from "@/lib/db/shareTokens";
import type { ShareToken } from "@/lib/types";
import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";

type ShareTokensContextType = {
  shareToken: ShareToken | null;
  setShareToken: (token: ShareToken | null) => void;
  enableShareToken: (groupId: string) => Promise<void>;
  disableShareToken: (groupId: string) => Promise<void>;
};

const ShareTokensContext = createContext<ShareTokensContextType | undefined>(
  undefined,
);

export const ShareTokensProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [shareToken, setShareTokenState] = useState<ShareToken | null>(null);

  const setShareToken = useCallback((token: ShareToken | null) => {
    setShareTokenState(token);
  }, []);

  const enableShareToken = useCallback(async (groupId: string) => {
    const token = await enableShareTokenDb(groupId);
    setShareTokenState(token);
  }, []);

  const disableShareToken = useCallback(async (groupId: string) => {
    const token = await disableShareTokenDb(groupId);
    setShareTokenState(token);
  }, []);

  return (
    <ShareTokensContext.Provider
      value={{
        shareToken,
        setShareToken,
        enableShareToken,
        disableShareToken,
      }}
    >
      {children}
    </ShareTokensContext.Provider>
  );
};

export const useShareTokens = () => {
  const ctx = useContext(ShareTokensContext);
  if (!ctx) {
    throw new Error("useShareTokens must be used within a ShareTokensProvider");
  }
  return ctx;
};
