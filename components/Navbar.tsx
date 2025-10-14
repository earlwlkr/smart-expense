'use client';

import type { User } from '@supabase/auth-js';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useGroups } from '@/lib/contexts/GroupsContext';
import { getProfile } from '@/lib/db/profiles';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/types';
import { Button } from './ui/button';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>();
  const [profile, setProfile] = useState<Profile>();
  const { currentGroup } = useGroups();
  const isSharePage = pathname.startsWith('/share/');

  useEffect(() => {
    const getData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      const profile = await getProfile();
      if (profile) {
        setProfile(profile);
      }
    };

    getData();
  }, [supabase.auth, pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="grid items-center grid-cols-3">
      <div>
        {pathname.startsWith('/groups/') && (
          <Link href="/">
            <Button type="button" variant="link">
              <ChevronLeft />
              Back
            </Button>
          </Link>
        )}
      </div>
      {user && !isSharePage && (
        <h1 className="font-semibold text-center md:text-2xl">
          {currentGroup?.name || 'Expenses'}
        </h1>
      )}
      {user && !isSharePage && (
        <div className="py-2 text-right">
          <Button
            type="button"
            variant="link"
            onClick={handleSignOut}
            className="inline pt-1 h-6"
          >
            Sign out
          </Button>
        </div>
      )}
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
    </div>
  );
}
