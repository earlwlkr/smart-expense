import Navbar from "@/components/Navbar";
import { GroupsProvider } from "@/lib/contexts/GroupsContext";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { OnboardingModal } from "@/components/OnboardingModal";
import { Toaster } from "@/components/ui/toaster";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexAuthNextjsServerProvider>
      <ConvexClientProvider>
        <GroupsProvider>
          <div className="mx-auto mt-4 w-full max-w-4xl px-4">
            <Navbar />
            <OnboardingModal />
            {children}
            <Toaster />
          </div>
        </GroupsProvider>
      </ConvexClientProvider>
    </ConvexAuthNextjsServerProvider>
  );
}
