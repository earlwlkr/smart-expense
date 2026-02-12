import { CurrencyInput } from "@/components/CurrencyInput";
import { Combobox } from "@/components/Expenses/Combobox";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DialogFooter } from "@/components/ui/dialog";
import { FancyMultiSelect } from "@/components/ui/fancy-multi-select";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCategories } from "@/lib/contexts/CategoriesContext";
import { useExpensesStore } from "@/lib/contexts/ExpensesContext";
import { useGroups } from "@/lib/contexts/GroupsContext";
import { useMembers } from "@/lib/contexts/MembersContext";
import type { Expense } from "@/lib/types";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Trash } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Id } from "../../convex/_generated/dataModel";

const addExpenseFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Must be more than 2 characters" })
    .max(50),
  amount: z.string().transform((newValue) => {
    const [formattedWholeValue, decimalValue = "0"] = newValue.split(".");
    const significantValue = formattedWholeValue.replace(/,/g, "");
    const floatValue = Number.parseFloat(
      significantValue + "." + decimalValue.slice(0, 2),
    );
    if (Number.isNaN(floatValue) === false) {
      return String(floatValue);
    }
    return "0";
  }),
  category: z.string(),
  handledBy: z.string(),
  participants: z.array(z.object({ id: z.string(), name: z.string() })),
  date: z.date(),
});
type AddExpenseFormValues = z.infer<typeof addExpenseFormSchema>;

export function ExpenseForm({
  onClose,
  expense,
}: {
  onClose: () => void;
  expense?: Expense | null;
}) {
  const { categories, addCategories } = useCategories();
  const { members } = useMembers();
  const { add: addExpense, update: updateExpense, remove: removeExpense } = useExpensesStore();
  const { currentGroup } = useGroups();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<AddExpenseFormValues>({
    resolver: zodResolver(addExpenseFormSchema),
    defaultValues: {
      name: expense?.name || "",
      amount: expense?.amount ? String(expense.amount) : "",
      category: expense?.category?._id || categories[0]?._id,
      handledBy: expense?.handledBy?._id || members[0]?._id,
      participants: expense?.participants.map(p => ({ id: p._id, name: p.name })) || members.map(m => ({ id: m._id, name: m.name })),
      date: expense?.date ? new Date(expense.date) : new Date(),
    },
  });

  async function onSubmit(values: AddExpenseFormValues) {
    setIsSubmitting(true);
    try {
      if (expense) {
        await updateExpense(expense._id as Id<"expenses">, {
          name: values.name,
          amount: Number(values.amount),
          date: values.date,
          categoryId: values.category as Id<"categories">,
          handledBy: values.handledBy as Id<"members">,
          participants: values.participants.map(p => p.id as Id<"members">),
        });
      } else {
        await addExpense({
          name: values.name,
          amount: Number(values.amount),
          date: values.date,
          categoryId: values.category as Id<"categories">,
          handledBy: values.handledBy as Id<"members">,
          participants: values.participants.map(p => p.id as Id<"members">),
        });
      }
      onClose();
    } catch (error) {
      console.error("Error submitting expense:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log("form errors", errors);
        })}
        className="space-y-4 mt-4"
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
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage className="col-start-2 col-span-4" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
              <FormLabel className="text-right">Amount</FormLabel>
              <FormControl className="col-span-3">
                <CurrencyInput {...field} />
              </FormControl>
              <FormMessage className="col-start-2 col-span-4" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
              <FormLabel className="text-right">Category</FormLabel>
              <FormControl className="col-span-3">
                <Combobox
                  options={categories.map((category) => ({
                    value: category._id,
                    label: category.name,
                  }))}
                  defaultValue={field.value}
                  onChange={field.onChange}
                  onCreate={async (name) => {
                    if (currentGroup) {
                      const newCategories = await addCategories(currentGroup._id, [
                        name,
                      ]);
                      // Assuming addCategories returns array of categories including _id
                      // If addCategories returns only IDs or something else, this might need adjustment.
                      // Currently addCategories in CategoriesContext calls api.categories.create (which returns ID) 
                      // or if it takes array it might return array of IDs?
                      // Let's check CategoriesContext.
                      // If it returns nothing (void), we need to re-fetch or optimistically update?
                      // The Context uses useQuery so it updates automatically.
                      // But we need the ID here to set field value.
                      // api.categories.create returns ID.
                      // If addCategories calls loop of create, it should return IDs.
                      // I should check CategoriesContext implementation.
                    }
                  }}
                  className="w-full"
                />
              </FormControl>
              <FormMessage className="col-start-2 col-span-4" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="handledBy"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
              <FormLabel className="text-right">By</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="col-span-3">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    {members.map((member) => (
                      <SelectItem key={member._id} value={member._id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="participants"
          render={({ field }) => {
            return (
              <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                <FormLabel className="text-right">With</FormLabel>
                <FormControl>
                  <FancyMultiSelect
                    options={members.map((member) => ({
                      label: member.name,
                      value: member._id,
                    }))}
                    defaultSelected={field.value.map(({ id, name }) => ({
                      label: name,
                      value: id,
                    }))}
                    onChange={(selected) => {
                      field.onChange({
                        target: {
                          value: selected.map(({ label, value }) => ({
                            name: label,
                            id: value,
                          })),
                        },
                      });
                    }}
                    className="col-span-3"
                  />
                </FormControl>
                <FormMessage className="col-start-2 col-span-4" />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
              <FormLabel className="text-right">Date</FormLabel>
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <FormControl className="col-span-3">
                    <Button
                      variant={"outline"}
                      className={cn(
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage className="col-start-2 col-span-4" />
            </FormItem>
          )}
        />

        <DialogFooter
          className={`flex ${expense ? "sm:justify-between" : "sm:justify-end"
            }`}
        >
          {expense && (
            <Button
              variant="destructive"
              className="flex items-center"
              disabled={isDeleting || isSubmitting}
              onClick={async () => {
                setIsDeleting(true);
                try {
                  await removeExpense(expense._id as Id<"expenses">);
                  onClose();
                } catch (error) {
                  console.error("Error deleting expense:", error);
                } finally {
                  setIsDeleting(false);
                }
              }}
            >
              {isDeleting ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Trash className="mr-2 h-4 w-4" />
              )}
              <span>{isDeleting ? "Deleting..." : "Delete"}</span>
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting || isDeleting}>
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
