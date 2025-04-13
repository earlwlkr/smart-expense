import { Group } from '../types';
import supabase from './init';

export const getGroups = async (): Promise<Group[]> => {
  const { data, error } = await supabase.from('groups').select();

  return data || [];
};

export const getGroupDetail = async (groupId: string) => {
  const { data, error } = await supabase
    .from('groups')
    .select()
    .eq('id', groupId);

  return data?.[0] || {};
};

export const addGroup = async (
  group: Omit<Group, 'id' | 'created_at'>,
  profileId: string
) => {
  const { data, error } = await supabase
    .from('groups')
    .insert({ ...group, profile_id: profileId })
    .select();
  if (error) return null;
  return data[0] as Group;
};
