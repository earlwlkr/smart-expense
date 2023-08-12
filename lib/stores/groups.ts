import { create } from 'zustand';
import { Group } from '../types';

type GroupsState = {
  group: Omit<Group, 'created_at'>;
  set: (group: Group) => void;
};

export const useGroupsStore = create<GroupsState>((set) => ({
  group: { id: '', name: '' },
  set: (group: Group) => set({ group }),
}));
