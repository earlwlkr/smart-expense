'use client';

import {
  User,
  createClientComponentClient,
} from '@supabase/auth-helpers-nextjs';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Profile } from '@/lib/types';
import { getProfile } from '@/lib/db/profiles';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User>();
  const [profile, setProfile] = useState<Profile>();

  useEffect(() => {
    const getData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
      const profile = await getProfile();
      if (profile) {
        setProfile(profile);
      }
    };

    getData();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="container flex justify-between">
      {pathname.startsWith('/groups/') && (
        <Link href="/">
          <Button type="button" variant="link">
            Back
          </Button>
        </Link>
      )}
      {user && (
        <div>
          Hi Mike,
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
    </div>
  );
}
