import { Member } from '../types';
import supabase from './init';

export const getMembers = async (groupId: string): Promise<Member[]> => {
  const { data, error } = await supabase
    .from('group_members')
    .select(
      `
    id,
    members ( id, name )
  `
    )
    .eq('groupId', groupId);

  return data?.map((item) => item.members).flat() || [];
};
