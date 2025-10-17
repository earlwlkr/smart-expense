import { ShareToken } from '@/lib/types';
import supabase from './init';

const mapToken = (item: any): ShareToken => ({
  id: item.id.toString(),
  groupId: item.group_id,
  disabled: item.disabled,
  createdAt: new Date(item.created_at),
});

const createShareToken = async (groupId: string): Promise<ShareToken> => {
  const { data, error } = await supabase
    .from('share_tokens')
    .insert({ group_id: groupId })
    .select()
    .single();

  if (!data) {
    throw new Error(error?.message || 'Failed to create share token');
  }

  return mapToken(data);
};

export const getShareToken = async (groupId: string): Promise<ShareToken> => {
  const { data } = await supabase
    .from('share_tokens')
    .select()
    .eq('group_id', groupId)
    .order('created_at', { ascending: false })
    .limit(1);

  const tokenRow = data?.[0];

  if (tokenRow) {
    return mapToken(tokenRow);
  }

  return createShareToken(groupId);
};

const setShareTokenDisabled = async (
  tokenId: string,
  disabled: boolean,
): Promise<ShareToken> => {
  const { data, error } = await supabase
    .from('share_tokens')
    .update({ disabled })
    .eq('id', tokenId)
    .select()
    .single();

  if (!data) {
    throw new Error(error?.message || 'Failed to update share token');
  }

  return mapToken(data);
};

export const disableShareToken = async (tokenId: string) =>
  setShareTokenDisabled(tokenId, true);

export const enableShareToken = async (
  groupId: string,
): Promise<ShareToken> => {
  const token = await getShareToken(groupId);

  if (!token.disabled) {
    return token;
  }

  return setShareTokenDisabled(token.id, false);
};
