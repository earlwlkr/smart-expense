'use client';

import { createClient } from '@/lib/supabase/client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Profile } from '@/lib/types';
import { getProfile } from '@/lib/db/profiles';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
} from 'lucide-react';
import { User } from '@supabase/auth-js';
import { useGroupsStore } from '@/lib/stores/groups';
import { useInitStore } from '@/lib/stores/useInitStore';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>();
  const [profile, setProfile] = useState<Profile>();
  const group = useGroupsStore((store) => store.group);

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
    <div className="flex items-center grid grid-cols-3">
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
      {user && (
        <h1 className="font-semibold text-center md:text-2xl">
          {group?.name || 'Expenses'}
        </h1>
      )}
      {user && (
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
