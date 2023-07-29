import { useEffect } from 'react';
import { getExpenses } from '../db/expenses';
import { useExpensesStore } from './expenses';
import { useMembersStore } from './members';
import { getMembers } from '../db/members';
import { getGroupDetail } from '../db/groups';
import { useGroupsStore } from './groups';
import { getCategories } from '../db/categories';
import { useCategoriesStore } from './categories';

export const useInitStore = (groupId: string) => {
  const setGroup = useGroupsStore((store) => store.set);
  const setCategories = useCategoriesStore((store) => store.set);
  const setExpenses = useExpensesStore((store) => store.set);
  const setMembers = useMembersStore((store) => store.update);

  useEffect(() => {
    const initGroup = async () => {
      const data = await getGroupDetail(groupId);
      setGroup(data);
    };
    const initCategories = async () => {
      const data = await getCategories(groupId);
      setCategories(data);
    };
    const initExpenses = async () => {
      const expenses = await getExpenses(groupId);
      setExpenses(expenses);
    };
    const initMembers = async () => {
      const members = await getMembers(groupId);
      setMembers(members);
    };
    const initStore = () => {
      return Promise.all([
        initGroup(),
        initCategories(),
        initExpenses(),
        initMembers(),
      ]);
    };

    initStore();
  }, [groupId, setCategories, setExpenses, setGroup, setMembers]);
};
