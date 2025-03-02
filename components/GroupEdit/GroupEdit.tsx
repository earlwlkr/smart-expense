import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addMember } from '@/lib/db/members';
import { useGroupsStore } from '@/lib/stores/groups';
import { useMembersStore } from '@/lib/stores/members';
import { Member } from '@/lib/types';
import { useRef, useState } from 'react';

export function GroupEdit() {
  const newMemberInputRef = useRef<HTMLInputElement>(null);
  const updateMembers = useMembersStore((store) => store.update);
  const group = useGroupsStore((store) => store.group);
  const members = useMembersStore((state) => state.members);
  const [tempMembers, setTempMembers] = useState<Member[]>(members);

  return (
    <div className="flex flex-col py-4 space-y-2">
      {tempMembers.map((item) => (
        <div key={item.id} className="flex max-w-sm items-center space-x-2">
          <div className="grow">{item.name}</div>
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
      <div className="flex max-w-sm items-center space-x-2">
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
    </div>
  );
}
