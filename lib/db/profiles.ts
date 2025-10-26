import supabase from './init';

export const getProfile = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select()
    .eq('id', user.id)
    .single();

  if (error) return null;

  return { id: data.id, firstName: data.first_name, lastName: data.last_name };
};

export const updateProfile = async (updates: {
  firstName?: string;
  lastName?: string;
}) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  // Only include fields that are provided
  const updateData: { first_name?: string; last_name?: string } = {};
  if (updates.firstName !== undefined) {
    updateData.first_name = updates.firstName;
  }
  if (updates.lastName !== undefined) {
    updateData.last_name = updates.lastName;
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', user.id)
    .select();

  if (error) {
    throw error;
  }

  const item = data[0];
  return { id: item.id, firstName: item.first_name, lastName: item.last_name };
};
