import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCategories } from '@/lib/contexts/CategoriesContext';
import { useGroups } from '@/lib/contexts/GroupsContext';
import { useMembers } from '@/lib/contexts/MembersContext';
import { useTokens } from '@/lib/contexts/TokensContext';
import { useShareTokens } from '@/lib/contexts/ShareTokensContext';
import { addMember, removeMember } from '@/lib/db/members';

export function GroupEdit() {
  const { currentGroup } = useGroups();
  const { members, updateMembers } = useMembers();
  const {
    inviteToken,
    enableInviteToken,
    disableInviteToken,
    isLoading: inviteTokenLoading,
  } = useTokens();
  const {
    shareToken,
    enableShareToken,
    disableShareToken,
    isLoading: shareTokenLoading,
  } = useShareTokens();
  const [tempMembers, setTempMembers] = useState(members);
  const newMemberInputRef = useRef<HTMLInputElement>(null);

  const { categories, addCategories, removeCategory, loading: categoriesLoading } =
    useCategories();
  const [tempCategories, setTempCategories] = useState(categories);
  const newCategoryInputRef = useRef<HTMLInputElement>(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  useEffect(() => {
    setTempMembers(members);
  }, [members]);

  useEffect(() => {
    setTempCategories(categories);
  }, [categories]);

  const handleDeleteMember = (id: string) => {
    const updatedMembers = tempMembers.filter((member) => member.id !== id);
    setTempMembers(updatedMembers);
    removeMember(id);
    updateMembers(updatedMembers);
  };

  const handleDeleteCategory = (id: string) => {
    const updatedCategories = tempCategories.filter(
      (category) => category.id !== id,
    );
    setTempCategories(updatedCategories);
    removeCategory(id);
  };

  const handleAddMember = async () => {
    if (!currentGroup || !newMemberInputRef.current) return;
    const name = newMemberInputRef.current.value.trim();
    if (!name) return;

    setIsAddingMember(true);
    try {
      const added = await addMember(currentGroup.id, { name });
      if (added && added.length > 0) {
        setTempMembers((prev) => {
          const updated = [...prev, ...added];
          updateMembers(updated);
          return updated;
        });
      }
      newMemberInputRef.current.value = '';
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleAddCategory = async () => {
    if (!currentGroup || !newCategoryInputRef.current) return;
    const name = newCategoryInputRef.current.value.trim();
    if (!name) return;

    setIsAddingCategory(true);
    try {
      await addCategories(currentGroup.id, [name]);
      setTempCategories((prev) => [
        ...prev,
        { id: Date.now().toString(), name },
      ]);
      newCategoryInputRef.current.value = '';
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleToggleInviteToken = async () => {
    if (!currentGroup) return;
    if (inviteToken && !inviteToken.disabled) {
      await disableInviteToken(currentGroup.id);
    } else {
      await enableInviteToken(currentGroup.id);
    }
  };

  const handleEnableInviteToken = async () => {
    if (!currentGroup) return;
    await enableInviteToken(currentGroup.id);
  };

  const handleToggleShareToken = async () => {
    if (!currentGroup) return;
    if (shareToken && !shareToken.disabled) {
      await disableShareToken(currentGroup.id);
    } else {
      await enableShareToken(currentGroup.id);
    }
  };

  const handleEnableShareToken = async () => {
    if (!currentGroup) return;
    await enableShareToken(currentGroup.id);
  };

  if (!currentGroup) {
    return <div>No group selected</div>;
  }

  return (
    <Tabs defaultValue="members" className="flex flex-col mt-2 min-h-[400px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
        <TabsTrigger value="access">Access</TabsTrigger>
      </TabsList>
      <TabsContent value="members">
        <div className="space-y-2">
          {tempMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between max-w-md p-2 border-b rounded-b-none rounded-md"
            >
              <span className="text-sm">{member.name}</span>
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleDeleteMember(member.id)}
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
              disabled={isAddingMember}
              onClick={handleAddMember}
            >
              {isAddingMember ? 'Adding…' : 'Add'}
            </Button>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="categories">
        <div className="space-y-2">
          {tempCategories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between max-w-md p-2 border-b rounded-b-none rounded-md"
            >
              <span className="text-sm">{category.name}</span>
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleDeleteCategory(category.id)}
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
              onClick={handleAddCategory}
              disabled={isAddingCategory || categoriesLoading}
            >
              {isAddingCategory || categoriesLoading ? 'Adding…' : 'Add'}
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
                    value={`${process.env.NEXT_PUBLIC_BASE_URL}/join/${inviteToken.id}`}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={async () => {
                      await navigator.clipboard.writeText(
                        `${process.env.NEXT_PUBLIC_BASE_URL}/join/${inviteToken.id}`,
                      );
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Status: {inviteToken.disabled ? 'Disabled' : 'Enabled'}
                </p>
                <div className="flex items-center space-x-2 max-w-md">
                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleToggleInviteToken}
                    disabled={inviteTokenLoading}
                  >
                    {inviteTokenLoading
                      ? 'Working…'
                      : inviteToken.disabled
                        ? 'Enable Invite Link'
                        : 'Disable Invite Link'}
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2 max-w-md">
                <Button
                  type="button"
                  className="w-full"
                  onClick={handleEnableInviteToken}
                  disabled={inviteTokenLoading}
                >
                  {inviteTokenLoading ? 'Working…' : 'Enable Invite Link'}
                </Button>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Read-only Links</h2>
            <p className="text-sm text-muted-foreground">
              Anyone with these links can view the group&apos;s expenses without
              needing an account.
            </p>
            {shareToken ? (
              <>
                <div className="flex flex-wrap items-center gap-2 max-w-xl py-2">
                  <Input
                    value={`${process.env.NEXT_PUBLIC_BASE_URL}/share/${shareToken.id}`}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={async () => {
                      await navigator.clipboard.writeText(
                        `${process.env.NEXT_PUBLIC_BASE_URL}/share/${shareToken.id}`,
                      );
                    }}
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Status: {shareToken.disabled ? 'Disabled' : 'Enabled'}
                </p>
                <div className="flex items-center space-x-2 max-w-md">
                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleToggleShareToken}
                    disabled={shareTokenLoading}
                  >
                    {shareTokenLoading
                      ? 'Working…'
                      : shareToken.disabled
                        ? 'Enable Share Link'
                        : 'Disable Share Link'}
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2 max-w-md">
                <Button
                  type="button"
                  className="w-full"
                  onClick={handleEnableShareToken}
                  disabled={shareTokenLoading}
                >
                  {shareTokenLoading ? 'Working…' : 'Enable Share Link'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
