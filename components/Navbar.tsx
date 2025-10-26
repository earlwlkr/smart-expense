'use client';

import type { User } from '@supabase/auth-js';
import { ChevronLeft, Settings, LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useGroups } from '@/lib/contexts/GroupsContext';
import { getProfile } from '@/lib/db/profiles';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/types';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const { currentGroup } = useGroups();
  const isSharePage = pathname.startsWith('/share/');

  useEffect(() => {
    const getData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // Fetch profile data
        const profileData = await getProfile();
        if (profileData) {
          setProfile(profileData);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    };

    getData();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
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
        <h1 className="font-semibold text-center md:text-2xl flex-1">
          {currentGroup?.name || 'Expenses'}
        </h1>
      )}
      {user && !isSharePage && (
        <div className="flex-1 justify-end flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <UserIcon className="h-4 w-4" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {profile
                  ? `${profile.firstName} ${profile.lastName || ''}`.trim()
                  : 'My Account'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
