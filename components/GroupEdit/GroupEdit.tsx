import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addMember } from '@/lib/db/members';
import { useCategoriesStore } from '@/lib/stores/categories';
import { useGroupsStore } from '@/lib/stores/groups';
import { useMembersStore } from '@/lib/stores/members';
import { useRef, useState } from 'react';
import { Separator } from '../ui/separator';
import { addCategories } from '@/lib/db/categories';

export function GroupEdit() {
  const group = useGroupsStore((store) => store.group);

  const members = useMembersStore((state) => state.members);
  const updateMembers = useMembersStore((store) => store.update);
  const [tempMembers, setTempMembers] = useState(members);
  const newMemberInputRef = useRef<HTMLInputElement>(null);

  const categories = useCategoriesStore((store) => store.categories);
  const addCategory = useCategoriesStore((store) => store.add);
  const [tempCategories, setTempCategories] = useState(categories);
  const newCategoryInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col py-4 space-y-2">
      <h2 className="font-semibold">Members</h2>
      {tempMembers.map((item) => (
        <div key={item.id} className="flex max-w-sm items-center space-x-2">
          <div className="grow text-sm">{item.name}</div>
          {/* <Button
                type="button"
                variant="link"
                onClick={() => {
                  setMembers((members) =>
                    members.filter((member) => member.id !== item.id)
                  );
                }}
              >
                Remove
              </Button> */}
        </div>
      ))}
      <div className="flex max-w-sm items-center space-x-2 mb-2">
        <Input placeholder="New member" ref={newMemberInputRef} />
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            if (!newMemberInputRef.current || !newMemberInputRef.current.value)
              return;

            setTempMembers([
              ...tempMembers,
              {
                id: Date.now().toString(),
                name: newMemberInputRef.current.value,
              },
            ]);
            addMember(group.id, { name: newMemberInputRef.current.value });
            updateMembers([
              ...tempMembers,
              {
                id: Date.now().toString(),
                name: newMemberInputRef.current.value,
              },
            ]);
            newMemberInputRef.current.value = '';
          }}
        >
          Add
        </Button>
      </div>
      <Separator className="my-2" />
      <h2 className="font-semibold">Categories</h2>
      {tempCategories.map((category) => (
        <div key={category.id} className="flex max-w-sm items-center space-x-2">
          <div className="grow text-sm">{category.name}</div>
        </div>
      ))}
      <div className="flex max-w-sm items-center space-x-2 mb-2">
        <Input placeholder="New category" ref={newCategoryInputRef} />
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            if (
              !newCategoryInputRef.current ||
              !newCategoryInputRef.current.value
            )
              return;

            setTempCategories([
              ...tempCategories,
              {
                id: Date.now().toString(),
                name: newCategoryInputRef.current.value,
              },
            ]);
            addCategories(group.id, [newCategoryInputRef.current.value]);
            addCategory({
              id: Date.now().toString(),
              name: newCategoryInputRef.current.value,
            });
            newCategoryInputRef.current.value = '';
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
