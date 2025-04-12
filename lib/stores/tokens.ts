import { create } from 'zustand';
import { Token } from '../types';
import { createToken } from '../db/tokens';

type TokensState = {
  tokens: Token[];
  add: (groupId: string) => void;
  set: (tokens: Token[]) => void;
  update: (tokens: Token[]) => void;
};

export const useTokensStore = create<TokensState>((set) => ({
  tokens: [],
  add: async (groupId: string) => {
    const created = await createToken(groupId);
    set((state) => {
      return { tokens: [...state.tokens, created] };
    });
  },
  set: (tokens: Token[]) => set({ tokens }),
  update: (tokens: Token[]) => set({ tokens }),
}));
