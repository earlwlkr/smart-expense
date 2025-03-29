import { Category } from '../types';
import supabase from './init';

export const getCategories = async (groupId: string): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select()
    .eq('group_id', groupId);
  return (
    data?.map((item) => ({ id: item.id.toString(), name: item.name })) || []
  );
};

export const addCategories = async (groupId: string, categories: string[]) => {
  const { error, data } = await supabase
    .from('categories')
    .insert(categories.map((name) => ({ name, group_id: groupId })))
    .select();
  return data;
};

export const removeCategory = async (categoryId: string) => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId);
};
