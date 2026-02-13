"use client";

import { useGroups } from "@/lib/contexts/GroupsContext";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { ChevronLeft, LogOut, Settings, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../convex/_generated/api";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LoadingSpinner } from "./ui/loading-spinner";
import { SettingsModal } from "./SettingsModal";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useAuthActions();
  const me = useQuery(api.users.me);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { currentGroup } = useGroups();
  const isSharePage = pathname.startsWith("/share/");

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        {pathname.startsWith("/groups/") && (
          <Link href="/">
            <Button type="button" variant="link">
              <ChevronLeft />
              Back
            </Button>
          </Link>
        )}
      </div>
      {me && !isSharePage && (
        <h1 className="font-semibold text-center md:text-2xl flex-1">
          {currentGroup?.name || "Expenses"}
        </h1>
      )}
      {me && !isSharePage && (
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
                {me.name || me.email || "My Account"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setIsSettingsOpen(true)}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="text-red-600"
              >
                {isSigningOut ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <LogOut className="mr-2 h-4 w-4" />
                )}
                {isSigningOut ? "Signing out..." : "Sign out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      {me && (
        <SettingsModal
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
        />
      )}
    </div>
  );
}
