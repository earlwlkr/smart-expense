import supabase from '@/lib/db/init';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';
// import type { Database } from '@/lib/database.types';

export async function GET(request: NextRequest) {
  const { error } = await supabase.auth.signOut()
  console.log('logOut error', error)
  return NextResponse.redirect('/login');
}
