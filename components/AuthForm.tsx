import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AuthForm() {
  const router = useRouter();
  const [signup, setSignUp] = useState(false);
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    router.refresh();
  };

  const handleSignIn = async () => {
    await supabase.auth.signInWithPassword({
      email,
      password,
    });
    router.refresh();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };
  const isLoading = false;

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {!signup && 'Login'}
          {signup && 'Create an account'}
        </h1>
        {signup && (
          <p className="text-sm text-muted-foreground">
            Enter your email below to create your account
          </p>
        )}
      </div>
      <div className="grid gap-6">
        {!signup && (
          <form>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="email">
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <Input
                  id="password"
                  type="password"
                  disabled={isLoading}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              <Button type="button" disabled={isLoading} onClick={handleSignIn}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Login
              </Button>
            </div>
          </form>
        )}

        {signup && (
          <form>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="email">
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <Input
                  id="password"
                  type="password"
                  disabled={isLoading}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              <Button type="button" disabled={isLoading} onClick={handleSignUp}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign Up
              </Button>
            </div>
          </form>
        )}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={() => setSignUp(!signup)}
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}{' '}
          {signup ? 'Login' : 'Sign up'}
        </Button>
      </div>
    </>
  );
}
