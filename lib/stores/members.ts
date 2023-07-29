import { create } from 'zustand';
import { Member } from '../types';

type MembersState = {
  members: Member[];
  update: (members: Member[]) => void;
};

export const useMembersStore = create<MembersState>((set) => ({
  members: [],
  update: (members: Member[]) => set({ members }),
}));
