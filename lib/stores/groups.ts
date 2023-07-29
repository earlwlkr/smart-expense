import { create } from 'zustand';
import { Group, Member } from '../types';

type GroupsState = {
  group: Group;
  set: (group: Group) => void;
};

export const useGroupsStore = create<GroupsState>((set) => ({
  group: { id: '', name: '' },
  set: (group: Group) => set({ group }),
}));
