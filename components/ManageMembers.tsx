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
  const [members, setMembers] = useState(useMembersStore.getState().members);
  const newMemberInputRef = useRef<HTMLInputElement>(null);
  const updateMembers = useMembersStore((store) => store.update);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Manage members</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Manage members</DialogTitle>
          </DialogHeader>

          <div className="grid py-4">
            {members.map((item) => (
              <div key={item.id}>{item.name}</div>
            ))}
            <div className="flex w-full max-w-sm items-center">
              <Input placeholder="New member" ref={newMemberInputRef} />
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  if (!newMemberInputRef.current) return;

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
