import { addDays } from 'date-fns';
import { ShareToken } from '@/lib/types';
import supabase from './init';

const mapToken = (item: any): ShareToken => ({
  id: item.id.toString(),
  groupId: item.group_id,
  disabled: item.disabled,
  createdAt: new Date(item.created_at),
  expiresAt: item.expires_at ? new Date(item.expires_at) : null,
});

export const getActiveShareTokens = async (
  groupId: string,
): Promise<ShareToken[]> => {
  const { data } = await supabase
    .from('share_tokens')
    .select()
    .eq('group_id', groupId)
    .order('created_at', { ascending: false });

  const now = new Date();

  return (
    data?.map(mapToken).filter((token) => {
      if (token.disabled) return false;
      if (!token.expiresAt) return true;
      return token.expiresAt > now;
    }) || []
  );
};

export const createShareToken = async (groupId: string) => {
  const expiresAt = addDays(new Date(), 30);
  const { data, error } = await supabase
    .from('share_tokens')
    .insert({ group_id: groupId, expires_at: expiresAt.toISOString() })
    .select()
    .single();

  if (!data) {
    throw new Error(error?.message || 'Failed to create share token');
  }

  return mapToken(data);
};

export const disableShareToken = async (tokenId: string) => {
  await supabase
    .from('share_tokens')
    .update({ disabled: true })
    .eq('id', tokenId);
};
