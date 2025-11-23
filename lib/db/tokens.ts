import type { Token } from "../types";
import supabase from "./init";

const mapToken = (item: any): Token => ({
  id: item.id.toString(),
  groupId: item.group_id,
  disabled: item.disabled,
  createdAt: new Date(item.created_at),
});

const fetchLatestInviteToken = async (
  groupId: string,
): Promise<Token | null> => {
  const { data } = await supabase
    .from("tokens")
    .select()
    .eq("group_id", groupId)
    .order("created_at", { ascending: false })
    .limit(1);

  const tokenRow = data?.[0];

  return tokenRow ? mapToken(tokenRow) : null;
};

const createInviteToken = async (groupId: string): Promise<Token> => {
  const { data, error } = await supabase
    .from("tokens")
    .insert({ group_id: groupId })
    .select()
    .single();

  if (!data) {
    throw new Error(error?.message || "Failed to create invite token");
  }

  return mapToken(data);
};

export const getInviteToken = async (groupId: string): Promise<Token | null> =>
  fetchLatestInviteToken(groupId);

const setInviteTokenDisabled = async (
  tokenId: string,
  disabled: boolean,
): Promise<Token> => {
  const { data, error } = await supabase
    .from("tokens")
    .update({ disabled })
    .eq("id", tokenId)
    .select()
    .single();

  if (!data) {
    throw new Error(error?.message || "Failed to update invite token");
  }

  return mapToken(data);
};

export const disableInviteToken = async (
  groupId: string,
): Promise<Token | null> => {
  const { error } = await supabase
    .from("tokens")
    .update({ disabled: true })
    .eq("group_id", groupId);

  if (error) {
    throw new Error(error.message || "Failed to disable invite token");
  }

  return fetchLatestInviteToken(groupId);
};

export const enableInviteToken = async (groupId: string): Promise<Token> => {
  const token = await fetchLatestInviteToken(groupId);

  if (!token) {
    return createInviteToken(groupId);
  }

  if (!token.disabled) {
    return token;
  }

  return setInviteTokenDisabled(token.id, false);
};
