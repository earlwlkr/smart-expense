import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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
import { addCategories } from '@/lib/db/categories';
import { addMember } from '@/lib/db/members';
import { getProfile } from '@/lib/db/profiles';
import { useGroups } from '@/lib/contexts/GroupsContext';
import { Icons } from '@/components/ui/icons';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';

const createGroupFormSchema = z.object({
  name: z.string().min(2).max(50),
});
type AddExpenseFormValues = z.infer<typeof createGroupFormSchema>;

export function CreateGroup() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<{
    id: string;
    firstName: string;
    lastName: string;
  } | null>(null);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addGroup: createGroup } = useGroups();

  const form = useForm<AddExpenseFormValues>({
    resolver: zodResolver(createGroupFormSchema),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    const initProfile = async () => {
      const profile = await getProfile();
      if (!profile) return;
      setProfile(profile);
    };

    initProfile();
  }, []);

  async function onSubmit(values: AddExpenseFormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    if (!profile) {
      console.error('Profile not found');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await createGroup({ name: values.name }, profile.id);
      if (!created) {
        return;
      }
      await Promise.all([
        addMember(
          created.id,
          { name: profile.firstName || 'user' },
          profile.id,
        ),
        addCategories(created.id, ['Eats', 'Drinks']),
      ]);
      setOpen(false);
      router.push(`/groups/${created.id}`);
    } catch (error) {
      console.error('Failed to create group', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={isSubmitting}>
          Create Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
          {/* <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription> */}
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log('form errors', errors);
            })}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                  <FormLabel className="text-right">Name</FormLabel>
                  <FormControl className="col-span-3">
                    <Input
                      placeholder="description"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? 'Creating...' : 'Save changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
