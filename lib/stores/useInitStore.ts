import { useEffect } from 'react';
import { getExpenses } from '../db/expenses';
import { useMembersStore } from './members';
import { getMembers } from '../db/members';
import { getGroupDetail } from '../db/groups';
import { useGroupsStore } from './groups';
import { getCategories } from '../db/categories';
import { useCategories } from '../contexts/CategoriesContext';
import { useTokensStore } from './tokens';
import { getActiveTokens } from '../db/tokens';
import { useExpensesStore } from '../contexts/ExpensesContext';

export const useInitStore = (groupId: string) => {
  const setGroup = useGroupsStore((store) => store.set);
  const { setCategories } = useCategories();
  const { set: setExpenses } = useExpensesStore();
  const setMembers = useMembersStore((store) => store.update);
  const setTokens = useTokensStore((store) => store.set);

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
    const initTokens = async () => {
      const tokens = await getActiveTokens(groupId);
      setTokens(tokens);
    };
    const initStore = () => {
      return Promise.all([
        initGroup(),
        initCategories(),
        initExpenses(),
        initMembers(),
        initTokens(),
      ]);
    };

    initStore();
  }, [groupId, setCategories, setExpenses, setGroup, setMembers, setTokens]);
};
