import React, { createContext, useContext, useState, useCallback } from 'react';
import { Token } from '@/lib/types';
import { createToken } from '@/lib/db/tokens';

type TokensContextType = {
  tokens: Token[];
  addToken: (groupId: string) => Promise<void>;
  setTokens: (tokens: Token[]) => void;
};

const TokensContext = createContext<TokensContextType | undefined>(undefined);

export const TokensProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tokens, setTokens] = useState<Token[]>([]);

  const addToken = useCallback(async (groupId: string) => {
    const created = await createToken(groupId);
    setTokens((prev) => [...prev, created]);
  }, []);

  return (
    <TokensContext.Provider value={{ tokens, addToken, setTokens }}>
      {children}
    </TokensContext.Provider>
  );
};

export const useTokens = () => {
  const ctx = useContext(TokensContext);
  if (!ctx) throw new Error('useTokens must be used within a TokensProvider');
  return ctx;
};
