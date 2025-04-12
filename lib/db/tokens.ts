import { Token } from '../types';
import supabase from './init';
import { addDays } from 'date-fns';

export const getActiveTokens = async (groupId: string): Promise<Token[]> => {
  const { data, error } = await supabase
    .from('tokens')
    .select()
    .eq('group_id', groupId);
  return (
    data?.map((item) => ({
      id: item.id.toString(),
      groupId: item.group_id,
      disabled: item.disabled,
      createdAt: new Date(item.created_at),
    })) || []
  ).filter((item) => !item.disabled && addDays(new Date(), 7) > new Date());
};

export const createToken = async (groupId: string) => {
  const { error, data } = await supabase
    .from('tokens')
    .insert({ group_id: groupId })
    .select()
    .single();
  return data as Token;
};
