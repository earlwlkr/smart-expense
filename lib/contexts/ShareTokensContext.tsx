import React, { createContext, useCallback, useContext, useState } from 'react';
import { ShareToken } from '@/lib/types';
import {
  createShareToken,
  disableShareToken,
} from '@/lib/db/shareTokens';

type ShareTokensContextType = {
  shareTokens: ShareToken[];
  setShareTokens: (tokens: ShareToken[]) => void;
  addShareToken: (groupId: string) => Promise<void>;
  revokeShareToken: (tokenId: string) => Promise<void>;
};

const ShareTokensContext =
  createContext<ShareTokensContextType | undefined>(undefined);

export const ShareTokensProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [shareTokens, setShareTokens] = useState<ShareToken[]>([]);

  const addShareToken = useCallback(async (groupId: string) => {
    const token = await createShareToken(groupId);
    setShareTokens((prev) => [...prev, token]);
  }, []);

  const revokeShareToken = useCallback(async (tokenId: string) => {
    await disableShareToken(tokenId);
    setShareTokens((prev) => prev.filter((token) => token.id !== tokenId));
  }, []);

  return (
    <ShareTokensContext.Provider
      value={{ shareTokens, setShareTokens, addShareToken, revokeShareToken }}
    >
      {children}
    </ShareTokensContext.Provider>
  );
};

export const useShareTokens = () => {
  const ctx = useContext(ShareTokensContext);
  if (!ctx) {
    throw new Error('useShareTokens must be used within a ShareTokensProvider');
  }
  return ctx;
};
