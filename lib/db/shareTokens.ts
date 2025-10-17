import { ShareToken } from '@/lib/types';
import supabase from './init';

const mapToken = (item: any): ShareToken => ({
  id: item.id.toString(),
  groupId: item.group_id,
  disabled: item.disabled,
  createdAt: new Date(item.created_at),
});

const fetchLatestShareToken = async (
  groupId: string,
): Promise<ShareToken | null> => {
  const { data } = await supabase
    .from('share_tokens')
    .select()
    .eq('group_id', groupId)
    .order('created_at', { ascending: false })
    .limit(1);

  const tokenRow = data?.[0];

  return tokenRow ? mapToken(tokenRow) : null;
};

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

export const getShareToken = async (
  groupId: string,
): Promise<ShareToken | null> => fetchLatestShareToken(groupId);

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

export const disableShareToken = async (
  groupId: string,
): Promise<ShareToken | null> => {
  const { error } = await supabase
    .from('share_tokens')
    .update({ disabled: true })
    .eq('group_id', groupId);

  if (error) {
    throw new Error(error.message || 'Failed to disable share tokens');
  }

  return fetchLatestShareToken(groupId);
};

export const enableShareToken = async (
  groupId: string,
): Promise<ShareToken> => {
  const token = await fetchLatestShareToken(groupId);

  if (!token) {
    return createShareToken(groupId);
  }

  if (!token.disabled) {
    return token;
  }

  return setShareTokenDisabled(token.id, false);
};
