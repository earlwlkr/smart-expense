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
import { useMembersStore } from '@/lib/stores/members';
import { useRef, useState } from 'react';

export function ManageMembers() {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState(useMembersStore.getState().members);
  const newMemberInputRef = useRef<HTMLInputElement>(null);
  const updateMembers = useMembersStore((store) => store.update);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Manage members</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Manage members</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col py-4 space-y-2 w-80">
            {members.map((item) => (
              <div
                key={item.id}
                className="flex max-w-sm items-center space-x-2"
              >
                <div className="grow">{item.name}</div>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => {
                    setMembers((members) =>
                      members.filter((member) => member.id !== item.id)
                    );
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
            <div className="flex max-w-sm items-center space-x-2">
              <Input placeholder="New member" ref={newMemberInputRef} />
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  if (
                    !newMemberInputRef.current ||
                    !newMemberInputRef.current.value
                  )
                    return;

                  setMembers([
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
          <DialogFooter>
            <Button
              type="submit"
              onClick={() => {
                updateMembers(members);
                setOpen(false);
              }}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
