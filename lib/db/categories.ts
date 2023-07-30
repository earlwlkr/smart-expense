import { Category } from '../types';
import supabase from './init';

export const getCategories = async (groupId: string): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select()
    .eq('groupId', groupId);
  console.log('data', data);

  return data || [];
};
