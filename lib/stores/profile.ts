import { create } from 'zustand';
import { Profile } from '../types';

type ProfileState = {
  profile: Profile;
  set: (profile: Profile) => void;
};

export const useProfileStore = create<ProfileState>((set) => ({
  profile: { id: '', firstName: '', lastName: '' },
  set: (profile: Profile) => set({ profile }),
}));
