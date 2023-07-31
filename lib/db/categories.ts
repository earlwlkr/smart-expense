import { Category } from '../types';
import supabase from './init';

export const getCategories = async (groupId: string): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select()
    .eq('groupId', groupId);
  return (
    data?.map((item) => ({ id: item.id.toString(), name: item.name })) || []
  );
};
