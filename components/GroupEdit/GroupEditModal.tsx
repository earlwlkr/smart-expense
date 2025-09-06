'use client';

import { useMediaQuery } from '@uidotdev/usehooks';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useMembers } from '@/lib/contexts/MembersContext';
import { GroupEdit } from './GroupEdit';

export function GroupEditModal() {
  const [open, setOpen] = useState(false);
  const { members, updateMembers } = useMembers();
  const isSmallDevice = useMediaQuery('only screen and (max-width : 768px)');

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
          <SheetTitle>Manage Group</SheetTitle>
        </SheetHeader>
        <GroupEdit />
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="text-gray-500">
          With <span>{members.map((member) => member.name).join(', ')}</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Group</DialogTitle>
        </DialogHeader>

        <GroupEdit />
      </DialogContent>
    </Dialog>
  );
}
