'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { addMember } from '@/lib/db/members';
import { useGroupsStore } from '@/lib/stores/groups';
import { useMembersStore } from '@/lib/stores/members';
import { Member } from '@/lib/types';
import { useEffect, useRef, useState } from 'react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { useMediaQuery } from '@uidotdev/usehooks';
import { ExpenseSplit } from '@/components/ExpenseSplit';

export function ManageMembers() {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const newMemberInputRef = useRef<HTMLInputElement>(null);
  const updateMembers = useMembersStore((store) => store.update);
  const group = useGroupsStore((store) => store.group);
  const isSmallDevice = useMediaQuery('only screen and (max-width : 768px)');

  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  useEffect(
    () =>
      useMembersStore.subscribe((state) => {
        setMembers(state.members);
      }),
    [setMembers]
  );

  const content = (
    <div className="flex flex-col py-4 space-y-2">
      {members.map((item) => (
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

            setMembers([
              ...members,
              {
                id: Date.now().toString(),
                name: newMemberInputRef.current.value,
              },
            ]);
            addMember(group.id, { name: newMemberInputRef.current.value });
            updateMembers([
              ...members,
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

  return isSmallDevice ? (
    <Sheet
      open={open}
      onOpenChange={(opening) => {
        if (!opening) {
          updateMembers(members);
        }
        setOpen(opening);
      }}
    >
      <SheetTrigger asChild>
        <div>
          With <span>{members.map((member) => member.name).join(', ')}</span>
        </div>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Manage members</SheetTitle>
        </SheetHeader>
        {content}
        <div>
          <ExpenseSplit />
        </div>
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>
          With <span>{members.map((member) => member.name).join(', ')}</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage members</DialogTitle>
        </DialogHeader>

        {content}
        <div>
          <ExpenseSplit />
        </div>
      </DialogContent>
    </Dialog>
  );
}
