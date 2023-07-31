'use client';

import {
  User,
  createClientComponentClient,
} from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

export default function Navbar() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const getData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      }
    };

    getData();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className="container flex justify-end">
      {user && (
        <Button type="button" variant="link" onClick={handleSignOut}>
          Sign out
        </Button>
      )}
    </div>
  );
}
