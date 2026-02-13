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
          <div className="md:flex md:justify-center">
            <div className="mt-4 mx-4 md:w-[400px]">
              <Navbar />
              <OnboardingModal />
              {children}
              <Toaster />
            </div>
          </div>
        </GroupsProvider>
      </ConvexClientProvider>
    </ConvexAuthNextjsServerProvider>
  );
}
