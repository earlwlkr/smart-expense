"use client";

import { GroupDetail } from "@/components/Groups/GroupDetail";
import { CategoriesProvider } from "@/lib/contexts/CategoriesContext";
import { ExpensesProvider } from "@/lib/contexts/ExpensesContext";
import { MembersProvider } from "@/lib/contexts/MembersContext";
import { ShareTokensProvider } from "@/lib/contexts/ShareTokensContext";
import { TokensProvider } from "@/lib/contexts/TokensContext";

export default async function Dashboard({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <CategoriesProvider>
      <MembersProvider>
        <ExpensesProvider>
          <TokensProvider>
            <ShareTokensProvider>
              <GroupDetail groupId={id} />
            </ShareTokensProvider>
          </TokensProvider>
        </ExpensesProvider>
      </MembersProvider>
    </CategoriesProvider>
  );
}
