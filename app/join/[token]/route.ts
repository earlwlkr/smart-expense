import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

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
  console.log('🚀 ~ user:', user);
  if (!user) {
    return new NextResponse('User not found');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select()
    .eq('id', user.id)
    .single();
  console.log('🚀 ~ profile:', profile);
  if (!profile) {
    return new NextResponse('Profile not found');
  }

  const { data: token } = await supabase
    .from('tokens')
    .select()
    .eq('id', tokenValue)
    .single();
  console.log('🚀 ~ token:', token);
  if (!token || token.disabled || token.created_at < new Date()) {
    return new NextResponse('Token invalid');
  }

  const groupId = token.group_id;
  const { data: existingMember } = await supabase
    .from('members')
    .select()
    .eq('group_id', groupId)
    .eq('profile_id', user.id)
    .single();
  console.log('🚀 ~ existingMember:', existingMember);
  if (existingMember) {
    return NextResponse.redirect(request.nextUrl.origin + `/groups/${groupId}`);
  }

  const { error } = await supabase
    .from('members')
    .insert({
      group_id: groupId,
      profile_id: user.id,
      name: profile.first_name,
    })
    .select()
    .single();
  if (error) {
    console.log('🚀 ~ insert member error:', error);
    return new NextResponse('Error executing request');
  }

  // update token disabled to true
  await supabase.from('tokens').update({ disabled: true }).eq('id', tokenValue);

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(request.nextUrl.origin + `/groups/${groupId}`);
}
