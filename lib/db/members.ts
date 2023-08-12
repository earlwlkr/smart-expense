import { Member } from '../types';
import supabase from './init';

export const getMembers = async (groupId: string): Promise<Member[]> => {
  const { data, error } = await supabase
    .from('members')
    .select()
    .eq('group_id', groupId);

  return data || [];
};

export const addMember = async (
  groupId: string,
  member: Omit<Member, 'id' | 'created_at'>,
  profileId?: string
) => {
  const { error } = await supabase
    .from('members')
    .insert({ ...member, group_id: groupId, profile_id: profileId });
};
