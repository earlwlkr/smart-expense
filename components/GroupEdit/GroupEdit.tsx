import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addMember, removeMember } from '@/lib/db/members';
import { addCategories, removeCategory } from '@/lib/db/categories';
import { useCategoriesStore } from '@/lib/stores/categories';
import { useGroupsStore } from '@/lib/stores/groups';
import { useMembersStore } from '@/lib/stores/members';
import { useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTokensStore } from '@/lib/stores/tokens';

export function GroupEdit() {
  const group = useGroupsStore((store) => store.group);

  const members = useMembersStore((state) => state.members);
  const tokens = useTokensStore((state) => state.tokens);
  const addToken = useTokensStore((state) => state.add);
  const updateMembers = useMembersStore((store) => store.update);
  const [tempMembers, setTempMembers] = useState(members);
  const newMemberInputRef = useRef<HTMLInputElement>(null);

  const categories = useCategoriesStore((store) => store.categories);
  const updateCategories = useCategoriesStore((store) => store.update);
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
      (category) => category.id !== id
    );
    setTempCategories(updatedCategories);
    removeCategory(id);
    updateCategories(updatedCategories);
  };

  return (
    <Tabs defaultValue="general" className="flex flex-col mt-2 min-h-[400px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Share Links</h2>
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
                      `${process.env.NEXT_PUBLIC_BASE_URL}/join/${token.id}`
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
                addToken(group.id);
              }}
            >
              Create New Link
            </Button>
          </div>
        </div>
      </TabsContent>
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

                const newMember = {
                  id: Date.now().toString(),
                  name: newMemberInputRef.current.value,
                };
                setTempMembers([...tempMembers, newMember]);
                const newMemberName = newMemberInputRef.current.value;
                newMemberInputRef.current.value = '';

                const added = await addMember(group.id, {
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

                const newCategory = {
                  id: Date.now().toString(),
                  name: newCategoryInputRef.current.value,
                };
                setTempCategories([...tempCategories, newCategory]);
                const added = await addCategories(group.id, [
                  newCategoryInputRef.current.value,
                ]);
                if (added && added.length > 0) {
                  updateCategories([...tempCategories, ...added]);
                }
                newCategoryInputRef.current.value = '';
              }}
            >
              Add
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
