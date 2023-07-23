import { create } from 'zustand';

export type Member = {
  id: string;
  name: string;
};

type MembersState = {
  members: Member[];
  update: (members: Member[]) => void;
};

export const useMembersStore = create<MembersState>((set) => ({
  members: [
    { id: '1', name: 'Mike' },
    { id: '2', name: 'Kallie' },
  ],
  update: (members: Member[]) => set({ members }),
}));
