'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { updateProfileName } from '@/lib/db/profiles';
import type { Profile } from '@/lib/types';

const profileNameSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be 50 characters or fewer'),
  lastName: z
    .string()
    .max(50, 'Last name must be 50 characters or fewer')
    .optional()
    .or(z.literal('')),
});

type ProfileNameFormValues = z.infer<typeof profileNameSchema>;

type UpdateProfileNameDialogProps = {
  profile?: Profile;
  onUpdated?: (profile: Profile) => void;
};

export function UpdateProfileNameDialog({
  profile,
  onUpdated,
}: UpdateProfileNameDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileNameFormValues>({
    resolver: zodResolver(profileNameSchema),
    defaultValues: {
      firstName: profile?.firstName ?? '',
      lastName: profile?.lastName ?? '',
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset({
        firstName: profile?.firstName ?? '',
        lastName: profile?.lastName ?? '',
      });
    }
  }, [form, open, profile?.firstName, profile?.lastName]);

  const onSubmit = async (values: ProfileNameFormValues) => {
    setIsSubmitting(true);
    try {
      const updatedProfile = await updateProfileName({
        firstName: values.firstName.trim(),
        lastName: values.lastName?.trim() ? values.lastName.trim() : undefined,
      });
      onUpdated?.(updatedProfile);
      toast({
        title: 'Profile updated',
        description: 'Your profile name has been saved.',
      });
      setOpen(false);
    } catch (error) {
      console.error('Failed to update profile', error);
      toast({
        title: 'Failed to update profile',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          form.reset({
            firstName: profile?.firstName ?? '',
            lastName: profile?.lastName ?? '',
          });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="link"
          className="inline h-6 px-0 pt-1"
        >
          {profile?.firstName ? `Hi, ${profile.firstName}` : 'Set profile name'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update profile name</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input placeholder="First name" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" disabled={isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
