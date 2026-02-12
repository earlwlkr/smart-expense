import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

const createGroupFormSchema = z.object({
  name: z.string().min(2).max(50),
});
type AddExpenseFormValues = z.infer<typeof createGroupFormSchema>;

export function CreateGroup() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const me = useQuery(api.users.me);
  const createGroup = useMutation(api.groups.create);
  const createMember = useMutation(api.members.create);
  const createCategory = useMutation(api.categories.create);

  const form = useForm<AddExpenseFormValues>({
    resolver: zodResolver(createGroupFormSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: AddExpenseFormValues) {
    if (!me) return;

    setLoading(true);
    try {
      const groupId = await createGroup({ name: values.name });

      // Add creator as member
      await createMember({
        name: me.name || me.email || "User",
        groupId,
        profileId: me._id,
      });

      // Add default categories
      await createCategory({ name: "Eats", groupId });
      await createCategory({ name: "Drinks", groupId });

      setOpen(false);
      router.push(`/groups/${groupId}`);
    } catch (error) {
      console.error("Failed to create group", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Group</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                  <FormLabel className="text-right">Name</FormLabel>
                  <FormControl className="col-span-3">
                    <Input placeholder="Group Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={loading || !me}>
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Group"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
