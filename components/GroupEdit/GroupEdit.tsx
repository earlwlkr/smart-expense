"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCategories } from "@/lib/contexts/CategoriesContext";
import { useGroups } from "@/lib/contexts/GroupsContext";
import { useMembers } from "@/lib/contexts/MembersContext";
import { useMutation, useQuery } from "convex/react";
import { useRef, useState } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { LoadingSpinner } from "../ui/loading-spinner";

export function GroupEdit() {
  const { currentGroup } = useGroups();
  const { members } = useMembers();
  const { categories } = useCategories();

  // Convex Hooks for Mutations
  const createMember = useMutation(api.members.create);
  const removeMember = useMutation(api.members.remove);

  const createCategory = useMutation(api.categories.create);
  const removeCategory = useMutation(api.categories.remove);

  // Tokens
  const inviteToken = useQuery(api.tokens.getInviteToken,
    currentGroup ? { groupId: currentGroup._id as Id<"groups"> } : "skip"
  );
  const shareToken = useQuery(api.tokens.getShareToken,
    currentGroup ? { groupId: currentGroup._id as Id<"groups"> } : "skip"
  );

  const createInviteToken = useMutation(api.tokens.createInviteToken);
  const toggleInviteToken = useMutation(api.tokens.toggleInviteToken);

  const createShareToken = useMutation(api.tokens.createShareToken);
  const toggleShareToken = useMutation(api.tokens.toggleShareToken);

  const newMemberInputRef = useRef<HTMLInputElement>(null);
  const newCategoryInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  if (!currentGroup) {
    return <div>No group selected</div>;
  }

  const handleDeleteMember = async (id: string) => {
    try {
      await removeMember({ id: id as Id<"members"> });
    } catch (error) {
      console.error("Failed to remove member:", error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await removeCategory({ id: id as Id<"categories"> });
    } catch (error) {
      console.error("Failed to remove category:", error);
    }
  };

  return (
    <Tabs defaultValue="members" className="flex flex-col mt-2 min-h-[400px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
        <TabsTrigger value="access">Access</TabsTrigger>
      </TabsList>
      <TabsContent value="members">
        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member._id}
              className="flex items-center justify-between max-w-md p-2 border-b rounded-b-none rounded-md"
            >
              <span className="text-sm">{member.name}</span>
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleDeleteMember(member._id)}
              >
                Remove
              </Button>
            </div>
          ))}
          <div className="flex items-center space-x-2 max-w-md">
            <Input
              placeholder="Enter new member name"
              ref={newMemberInputRef}
              className="flex-grow"
            />
            <Button
              type="button"
              disabled={loading}
              onClick={async () => {
                const name = newMemberInputRef.current?.value;
                if (!name) return;
                setLoading(true);
                try {
                  await createMember({
                    name,
                    groupId: currentGroup._id as Id<"groups">,
                  });
                  if (newMemberInputRef.current) newMemberInputRef.current.value = "";
                } finally {
                  setLoading(false);
                }
              }}
            >
              Add
            </Button>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="categories">
        <div className="space-y-2">
          {categories.map((category) => (
            <div
              key={category._id}
              className="flex items-center justify-between max-w-md p-2 border-b rounded-b-none rounded-md"
            >
              <span className="text-sm">{category.name}</span>
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleDeleteCategory(category._id)}
              >
                Remove
              </Button>
            </div>
          ))}
          <div className="flex items-center space-x-2 max-w-md">
            <Input
              placeholder="Enter new category name"
              ref={newCategoryInputRef}
              className="flex-grow"
            />
            <Button
              type="button"
              disabled={loading}
              onClick={async () => {
                const name = newCategoryInputRef.current?.value;
                if (!name) return;
                setLoading(true);
                try {
                  await createCategory({
                    name,
                    groupId: currentGroup._id as Id<"groups">,
                  });
                  if (newCategoryInputRef.current) newCategoryInputRef.current.value = "";
                } finally {
                  setLoading(false);
                }
              }}
            >
              Add
            </Button>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="access">
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Invite Links</h2>
            <p className="text-sm text-muted-foreground">
              Invite members to join the group with a single reusable link.
            </p>
            {inviteToken ? (
              <>
                <div className="flex flex-wrap items-center gap-2 max-w-xl py-2">
                  <Input
                    value={`${process.env.NEXT_PUBLIC_BASE_URL}/join/${inviteToken.token}`}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${process.env.NEXT_PUBLIC_BASE_URL}/join/${inviteToken.token}`,
                      );
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <div className="flex items-center space-x-2 max-w-md">
                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => toggleInviteToken({ id: inviteToken._id, disabled: !inviteToken.disabled })}
                  >
                    {inviteToken.disabled ? "Enable Invite Link" : "Disable Invite Link"}
                  </Button>
                </div>
              </>
            ) : (
              <Button onClick={() => createInviteToken({ groupId: currentGroup._id as Id<"groups"> })}>
                Generate Invite Link
              </Button>
            )}
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Read-only Links</h2>
            <p className="text-sm text-muted-foreground">
              Anyone with these links can view the group&apos;s expenses without needing an account.
            </p>
            {shareToken ? (
              <>
                <div className="flex flex-wrap items-center gap-2 max-w-xl py-2">
                  <Input
                    value={`${process.env.NEXT_PUBLIC_BASE_URL}/share/${shareToken.token}`}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${process.env.NEXT_PUBLIC_BASE_URL}/share/${shareToken.token}`,
                      );
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <div className="flex items-center space-x-2 max-w-md">
                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => toggleShareToken({ id: shareToken._id, disabled: !shareToken.disabled })}
                  >
                    {shareToken.disabled ? "Enable Share Link" : "Disable Share Link"}
                  </Button>
                </div>
              </>
            ) : (
              <Button onClick={() => createShareToken({ groupId: currentGroup._id as Id<"groups"> })}>
                Generate Share Link
              </Button>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
