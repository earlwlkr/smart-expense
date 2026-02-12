"use client";

import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { createContext, useContext, useMemo } from "react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import type { Category } from "../types";

type CategoriesContextType = {
    categories: Category[];
    loading: boolean;
    addCategories: (
        groupId: string,
        categories: string[],
    ) => Promise<Category[] | null>;
    removeCategory: (categoryId: string) => Promise<void>;
};

const CategoriesContext = createContext<CategoriesContextType | undefined>(
    undefined,
);

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const params = useParams();
    const groupId = params?.id as Id<"groups"> | undefined;

    const categories = useQuery(
        api.categories.list,
        groupId ? { groupId } : "skip",
    );
    const createCategory = useMutation(api.categories.create);
    const deleteCategory = useMutation(api.categories.remove);

    const loading = categories === undefined;

    const addCategories = async (targetGroupId: string, names: string[]) => {
        // We iterate because we don't have bulk insert yet, or we could add it.
        // Keeping signature similar.
        const results: Category[] = [];
        for (const name of names) {
            const id = await createCategory({
                name,
                groupId: targetGroupId as Id<"groups">,
            });
            results.push({ _id: id, name, groupId: targetGroupId, _creationTime: 0 } as Category);
        }
        return results;
    };

    const removeCategory = async (categoryId: string) => {
        await deleteCategory({ id: categoryId as Id<"categories"> });
    };

    const adaptedCategories = useMemo(() => {
        return (categories || []).map((c) => ({
            _id: c._id,
            name: c.name,
            groupId: c.groupId,
            _creationTime: c._creationTime
        }));
    }, [categories]);

    return (
        <CategoriesContext.Provider
            value={{
                categories: adaptedCategories,
                loading,
                addCategories,
                removeCategory,
            }}
        >
            {children}
        </CategoriesContext.Provider>
    );
};

export const useCategories = () => {
    const ctx = useContext(CategoriesContext);
    if (!ctx)
        throw new Error("useCategories must be used within a CategoriesProvider");
    return ctx;
};
