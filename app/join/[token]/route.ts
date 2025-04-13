import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { addDays } from 'date-fns';

// test URL:
// http://localhost:3000/join/7847cf33-9442-4718-be25-da4d87db2b7c
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const supabase = createClient(cookies());
  const { token: tokenValue } = await params;

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;
  console.log('🚀 ~ joingroup ~ user:', user);
  if (!user) {
    return new NextResponse('User not found');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select()
    .eq('id', user.id)
    .single();
  console.log('🚀 ~ joingroup ~ profile:', profile);
  if (!profile) {
    return new NextResponse('Profile not found');
  }

  const { data: token } = await supabase
    .from('tokens')
    .select()
    .eq('id', tokenValue)
    .single();
  const tokenExpiryDate = addDays(new Date(token.created_at), 7);
  console.log('🚀 ~ joingroup ~ token:', token, tokenExpiryDate, new Date());
  if (!token || token.disabled || tokenExpiryDate < new Date()) {
    return new NextResponse('Token invalid');
  }

  const groupId = token.group_id;
  const { data: existingMember } = await supabase
    .from('group_profiles')
    .select()
    .eq('group_id', groupId)
    .eq('profile_id', profile.id)
    .single();
  console.log('🚀 ~ joingroup ~ existingMember:', existingMember);
  if (existingMember) {
    return NextResponse.redirect(request.nextUrl.origin + `/groups/${groupId}`);
  }

  const { error } = await supabase.from('group_profiles').insert({
    group_id: groupId,
    profile_id: profile.id,
  });
  if (error) {
    console.log('🚀 ~ joingroup ~ insert member error:', error);
    return new NextResponse('Error executing request');
  }

  // update token disabled to true
  await supabase.from('tokens').update({ disabled: true }).eq('id', tokenValue);
  console.log('🚀 ~ joingroup ~ join successfully:', groupId, profile.id);

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(request.nextUrl.origin + `/groups/${groupId}`);
}
