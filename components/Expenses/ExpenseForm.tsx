import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useCategories } from '@/lib/contexts/CategoriesContext';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useMembers } from '@/lib/contexts/MembersContext';
import { useExpensesStore } from '@/lib/contexts/ExpensesContext';
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
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useGroups } from '@/lib/contexts/GroupsContext'; // <-- updated import
import { CurrencyInput } from '@/components/CurrencyInput';
import { FancyMultiSelect } from '@/components/ui/fancy-multi-select';
import { Combobox } from '@/components/Expenses/Combobox';
import { Expense } from '@/lib/types';
import { Trash } from 'lucide-react'; // Import the trash icon

const addExpenseFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Must be more than 2 characters' })
    .max(50),
  amount: z.string().transform((newValue) => {
    const [formattedWholeValue, decimalValue = '0'] = newValue.split('.');
    const significantValue = formattedWholeValue.replace(/,/g, '');
    const floatValue = parseFloat(
      significantValue + '.' + decimalValue.slice(0, 2),
    );
    if (isNaN(floatValue) === false) {
      return String(floatValue);
    }
    return '0';
  }),
  // .positive({ message: 'Must be positive' }),
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
  const { categories } = useCategories();
  const { members } = useMembers();
  const { add: addExpense } = useExpensesStore();
  const { update: updateExpense } = useExpensesStore();
  const { remove: removeExpense } = useExpensesStore();
  const { currentGroup } = useGroups();

  const form = useForm<AddExpenseFormValues>({
    resolver: zodResolver(addExpenseFormSchema),
    defaultValues: {
      name: expense?.name || '',
      amount: expense?.amount ? String(expense.amount) : '',
      category: expense?.category?.id || categories[0]?.id,
      handledBy: expense?.handledBy?.id || members[0]?.id,
      participants: expense?.participants || members,
      date: expense?.date ? new Date(expense.date) : new Date(),
    },
  });

  function onSubmit(values: AddExpenseFormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    if (expense) {
      updateExpense(expense.id, {
        ...values,
        id: expense.id,
        amount: String(values.amount),
        category: categories.find((item) => item.id === values.category),
        handledBy: members.find((item) => item.id === values.handledBy),
      });
    } else if (currentGroup) {
      addExpense(currentGroup.id, {
        id: Date.now().toString(),
        ...values,
        amount: String(values.amount),
        category: categories.find((item) => item.id === values.category),
        handledBy: members.find((item) => item.id === values.handledBy),
      });
    }
    onClose();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log('form errors', errors);
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
                {/* <Input placeholder="amount" type="number" {...field} /> */}
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

              <Combobox
                options={categories.map((category) => ({
                  value: category.id,
                  label: category.name,
                }))}
                defaultValue={field.value}
                onChange={field.onChange}
              />
              <FormMessage />
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
                      <SelectItem key={member.id} value={member.id}>
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
                      value: member.id,
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
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl className="col-span-3">
                    <Button
                      variant={'outline'}
                      className={cn(
                        // 'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground',
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
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
                      date > new Date() || date < new Date('1900-01-01')
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
          className={`flex ${
            expense ? 'sm:justify-between' : 'sm:justify-end'
          }`}
        >
          {expense && (
            <Button
              variant="destructive"
              className="flex items-center"
              onClick={() => {
                // Add your delete logic here
                console.log('Delete expense:', expense.id);
                removeExpense(expense.id);
                onClose();
              }}
            >
              <Trash /> {/* Trash icon */}
              <span>Delete</span>
            </Button>
          )}
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
