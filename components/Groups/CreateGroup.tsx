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
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../ui/form';
import { useEffect, useState } from 'react';
import { addGroup } from '@/lib/db/groups';
import { addMember } from '@/lib/db/members';
import { getProfile } from '@/lib/db/profiles';
import { useProfileStore } from '@/lib/stores/profile';
import { addCategories } from '@/lib/db/categories';
import { useRouter } from 'next/navigation';

const createGroupFormSchema = z.object({
  name: z.string().min(2).max(50),
});
type AddExpenseFormValues = z.infer<typeof createGroupFormSchema>;

export function CreateGroup({ fetchData }: { fetchData: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const currentProfile = useProfileStore((store) => store.profile);
  const setProfile = useProfileStore((store) => store.set);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    const initStore = () => {
      return Promise.all([initProfile()]);
    };

    initStore();
  }, [setProfile]);

  async function onSubmit(values: AddExpenseFormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    setLoading(true);
    const created = await addGroup(values, currentProfile.id);
    setLoading(false);
    if (!created) return null;
    addMember(
      created.id,
      { name: currentProfile.firstName || 'user' },
      currentProfile.id
    );
    addCategories(created.id, ['Eats', 'Drinks']);
    setOpen(false);
    // fetchData();
    router.push('/groups/' + created.id);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Group</Button>
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
                    <Input placeholder="description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
