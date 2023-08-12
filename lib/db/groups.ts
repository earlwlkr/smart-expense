import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Group } from '../types';
import supabase from './init';

export const getGroups = async (): Promise<Group[]> => {
  const supabase = createClientComponentClient();
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

export const addGroup = async (group: Omit<Group, 'id' | 'created_at'>) => {
  const supabase = createClientComponentClient();
  const user = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('groups')
    .insert({ ...group, user_id: user.data.user?.id })
    .select();
  if (error) return null;
  return data[0] as Group;
};
