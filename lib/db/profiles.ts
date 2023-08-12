import { Profile } from '../types';
import supabase from './init';

export const getProfile = async () => {
  const { data, error } = await supabase.from('profiles').select();

  if (error) return null;

  const item = data[0];
  return { id: item.id, firstName: item.first_name, lastName: item.last_name };
};
