import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { Icons } from "./ui/icons";

export default function AuthForm() {
  const { signIn } = useAuthActions();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signIn("google", { redirectTo: "/" });
    } catch (error) {
      console.error("Failed to sign in", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
      <p className="text-sm text-muted-foreground">
        Sign in to your account
      </p>

      <div className="grid gap-6 mt-4">
        <Button
          variant="outline"
          type="button"
          disabled={loading}
          onClick={handleGoogleSignIn}
        >
          {loading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
