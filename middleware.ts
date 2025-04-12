import { createClient } from '@/lib/supabase/middleware';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const { supabase, res } = createClient(req);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // if user is not signed in and the current path is not / redirect the user to /
  if (!user && req.nextUrl.pathname !== '/login') {
    return NextResponse.redirect(
      new URL('/login?nextUrl=' + req.nextUrl.pathname, req.url)
    );
  }

  if (user && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/', '/login', '/groups/:id*'],
};
