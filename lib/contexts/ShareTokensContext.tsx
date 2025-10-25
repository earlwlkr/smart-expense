import React, { createContext, useCallback, useContext, useState } from 'react';
import { ShareToken } from '@/lib/types';
import {
  disableShareToken as disableShareTokenDb,
  enableShareToken as enableShareTokenDb,
} from '@/lib/db/shareTokens';

type ShareTokensContextType = {
  shareToken: ShareToken | null;
  setShareToken: (token: ShareToken | null) => void;
  enableShareToken: (groupId: string) => Promise<void>;
  disableShareToken: (groupId: string) => Promise<void>;
  isLoading: boolean;
};

const ShareTokensContext =
  createContext<ShareTokensContextType | undefined>(undefined);

export const ShareTokensProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [shareToken, setShareTokenState] = useState<ShareToken | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setShareToken = useCallback((token: ShareToken | null) => {
    setShareTokenState(token);
  }, []);

  const enableShareToken = useCallback(async (groupId: string) => {
    setIsLoading(true);
    try {
      const token = await enableShareTokenDb(groupId);
      setShareTokenState(token);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disableShareToken = useCallback(async (groupId: string) => {
    setIsLoading(true);
    try {
      const token = await disableShareTokenDb(groupId);
      setShareTokenState(token);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <ShareTokensContext.Provider
      value={{
        shareToken,
        setShareToken,
        enableShareToken,
        disableShareToken,
        isLoading,
      }}
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
