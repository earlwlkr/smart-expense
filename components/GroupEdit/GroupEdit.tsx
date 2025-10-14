import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCategories } from '@/lib/contexts/CategoriesContext';
import { useGroups } from '@/lib/contexts/GroupsContext'; // <-- updated import
import { useMembers } from '@/lib/contexts/MembersContext';
import { useTokens } from '@/lib/contexts/TokensContext';
import { useShareTokens } from '@/lib/contexts/ShareTokensContext';
import { addMember, removeMember } from '@/lib/db/members';

export function GroupEdit() {
  const { currentGroup } = useGroups();
  const { members, updateMembers } = useMembers();
  const { tokens, addToken } = useTokens();
  const { shareTokens, addShareToken, revokeShareToken } = useShareTokens();
  const [tempMembers, setTempMembers] = useState(members);
  const newMemberInputRef = useRef<HTMLInputElement>(null);

  const { categories, addCategories, removeCategory } = useCategories();
  const [tempCategories, setTempCategories] = useState(categories);
  const newCategoryInputRef = useRef<HTMLInputElement>(null);

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

  if (!currentGroup) {
    return <div>No group selected</div>;
  }

  return (
    <Tabs defaultValue="members" className="flex flex-col mt-2 min-h-[400px]">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
        <TabsTrigger value="invite">Invite</TabsTrigger>
        <TabsTrigger value="share">Share</TabsTrigger>
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
              onClick={async () => {
                if (
                  !newMemberInputRef.current ||
                  !newMemberInputRef.current.value
                )
                  return;

                const newMemberName = newMemberInputRef.current.value;
                const newMember = {
                  id: Date.now().toString(),
                  name: newMemberName,
                };
                setTempMembers([...tempMembers, newMember]);
                newMemberInputRef.current.value = '';

                const added = await addMember(currentGroup.id, {
                  name: newMemberName,
                });
                if (added && added.length > 0) {
                  updateMembers([...members, ...added]);
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
              onClick={async () => {
                if (
                  !newCategoryInputRef.current ||
                  !newCategoryInputRef.current.value
                )
                  return;

                const newCategoryName = newCategoryInputRef.current.value;
                const newCategory = {
                  id: Date.now().toString(),
                  name: newCategoryName,
                };
                setTempCategories([...tempCategories, newCategory]);
                newCategoryInputRef.current.value = '';

                await addCategories(currentGroup.id, [newCategoryName]);
              }}
            >
              Add
            </Button>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="invite">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Invite Links</h2>
          <div>
            {tokens.map((token) => (
              <div
                key={token.id}
                className="flex items-center justify-between max-w-md py-2 rounded-lg shadow-sm"
              >
                <Input
                  value={`${process.env.NEXT_PUBLIC_BASE_URL}/join/${token.id}`}
                  readOnly
                  className="flex-grow"
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="ml-2"
                  onClick={async () => {
                    // Copy to clipboard
                    await navigator.clipboard.writeText(
                      `${process.env.NEXT_PUBLIC_BASE_URL}/join/${token.id}`,
                    );
                  }}
                >
                  Copy
                </Button>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2 max-w-md">
            <Button
              type="button"
              className="w-full"
              onClick={() => {
                addToken(currentGroup.id);
              }}
            >
              Create New Link
            </Button>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="share">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Read-only Links</h2>
          <p className="text-sm text-muted-foreground">
            Anyone with these links can view the group&apos;s expenses without
            needing an account.
          </p>
          <div>
            {shareTokens.map((token) => (
              <div
                key={token.id}
                className="flex flex-wrap items-center gap-2 max-w-xl py-2"
              >
                <Input
                  value={`${process.env.NEXT_PUBLIC_BASE_URL}/share/${token.id}`}
                  readOnly
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={async () => {
                    await navigator.clipboard.writeText(
                      `${process.env.NEXT_PUBLIC_BASE_URL}/share/${token.id}`,
                    );
                  }}
                >
                  Copy
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => revokeShareToken(token.id)}
                >
                  Disable
                </Button>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2 max-w-md">
            <Button
              type="button"
              className="w-full"
              onClick={() => {
                addShareToken(currentGroup.id);
              }}
            >
              Create Share Link
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
