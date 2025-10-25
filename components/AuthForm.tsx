import { Info, Terminal } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export default function AuthForm() {
  const router = useRouter();
  const [signup, setSignUp] = useState(false);
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  // get nextUrl from URL params
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('nextUrl');

  const handleSignUp = async () => {
    setAuthMessage(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });
      if (error) {
        setAuthMessage(error.message);
        return;
      }
      setAuthMessage('Check your email for verification request!');

      const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({ first_name: firstName })
        .eq('id', data.user?.id);
      console.log('updateData', { updateData, updateError });
      if (nextUrl) {
        router.push(nextUrl);
        return;
      }
      router.push('/');
    } catch (error) {
      console.error('Failed to sign up', error);
      setAuthMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setAuthMessage(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setAuthMessage(error.message);
        return;
      }
      if (nextUrl) {
        router.push(nextUrl);
        return;
      }
      router.push('/');
    } catch (error) {
      console.error('Failed to sign in', error);
      setAuthMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignInAnonymously = async () => {
    setAuthMessage(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) {
        setAuthMessage(error.message);
        return;
      }
      if (nextUrl) {
        router.push(nextUrl);
        return;
      }
      router.push('/');
    } catch (error) {
      console.error('Failed to sign in anonymously', error);
      setAuthMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignInWithFacebook = async () => {
    setAuthMessage(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: 'https://smart-expense-one.vercel.app/auth/callback',
        },
      });
      if (error) {
        setAuthMessage(error.message);
        return;
      }
      router.refresh();
    } catch (error) {
      console.error('Failed to sign in with Facebook', error);
      setAuthMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

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
        <form className="flex flex-col space-y-4">
          {signup && (
            <Input
              id="firstName"
              placeholder="first name"
              disabled={isLoading}
              onChange={(event) => setFirstName(event.target.value)}
            />
          )}
          <Input
            id="email"
            placeholder="email"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            id="password"
            placeholder="password"
            type="password"
            disabled={isLoading}
            onChange={(event) => setPassword(event.target.value)}
          />

          <Button
            type="button"
            disabled={isLoading}
            onClick={signup ? handleSignUp : handleSignIn}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {!signup ? 'Login' : 'Sign up'}
          </Button>
          {authMessage && (
            <Alert>
              <Info className="h-4 w-4" />
              {/* <AlertTitle>Heads up!</AlertTitle> */}
              <AlertDescription>{authMessage}</AlertDescription>
            </Alert>
          )}
        </form>

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
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={handleSignInAnonymously}
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}{' '}
          Sign in anonymously
        </Button>
        {/* <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={handleSignInWithFacebook}
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}{' '}
          Sign In with Facebook
        </Button> */}
      </div>
    </>
  );
}
