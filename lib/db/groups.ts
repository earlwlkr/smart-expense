import supabase from './init';

export const getGroups = async () => {
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
