import React, { createContext, useContext, useState, useCallback } from 'react';
import { Token } from '@/lib/types';
import {
  disableInviteToken as disableInviteTokenDb,
  enableInviteToken as enableInviteTokenDb,
} from '@/lib/db/tokens';

type TokensContextType = {
  inviteToken: Token | null;
  setInviteToken: (token: Token | null) => void;
  enableInviteToken: (groupId: string) => Promise<void>;
  disableInviteToken: (groupId: string) => Promise<void>;
  isLoading: boolean;
};

const TokensContext = createContext<TokensContextType | undefined>(undefined);

export const TokensProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [inviteToken, setInviteTokenState] = useState<Token | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setInviteToken = useCallback((token: Token | null) => {
    setInviteTokenState(token);
  }, []);

  const enableInviteToken = useCallback(async (groupId: string) => {
    setIsLoading(true);
    try {
      const token = await enableInviteTokenDb(groupId);
      setInviteTokenState(token);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disableInviteToken = useCallback(async (groupId: string) => {
    setIsLoading(true);
    try {
      const token = await disableInviteTokenDb(groupId);
      setInviteTokenState(token);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <TokensContext.Provider
      value={{
        inviteToken,
        setInviteToken,
        enableInviteToken,
        disableInviteToken,
        isLoading,
      }}
    >
      {children}
    </TokensContext.Provider>
  );
};

export const useTokens = () => {
  const ctx = useContext(TokensContext);
  if (!ctx) throw new Error('useTokens must be used within a TokensProvider');
  return ctx;
};
