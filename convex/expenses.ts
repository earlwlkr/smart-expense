import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
    args: {
        name: v.string(),
        amount: v.number(),
        date: v.string(), // ISO date
        groupId: v.id("groups"),
        categoryId: v.optional(v.id("categories")),
        handledBy: v.optional(v.id("members")),
        participants: v.array(v.id("members")),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const expenseId = await ctx.db.insert("expenses", {
            name: args.name,
            amount: args.amount,
            date: args.date,
            groupId: args.groupId,
            categoryId: args.categoryId,
            handledBy: args.handledBy,
            participants: args.participants,
            createdAt: Date.now(),
        });
        return expenseId;
    },
});

export const update = mutation({
    args: {
        id: v.id("expenses"),
        name: v.string(),
        amount: v.number(),
        date: v.string(),
        categoryId: v.optional(v.id("categories")),
        handledBy: v.optional(v.id("members")),
        participants: v.array(v.id("members")),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        await ctx.db.patch(args.id, {
            name: args.name,
            amount: args.amount,
            date: args.date,
            categoryId: args.categoryId,
            handledBy: args.handledBy,
            participants: args.participants,
        });
    },
});

export const list = query({
    args: { groupId: v.id("groups") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];

        const expenses = await ctx.db
            .query("expenses")
            .withIndex("by_groupId", (q) => q.eq("groupId", args.groupId))
            .collect();

        // We need to join with categories and members to match the extensive return type of `getExpenses`
        // which includes full category and member objects.
        // Convex doesn't do joins automatically. We have to fetch related data.

        // Optimisation: Fetch all categories and members for the group once.
        const categories = await ctx.db
            .query("categories")
            .filter((q) => q.eq(q.field("groupId"), args.groupId))
            .collect();

        const members = await ctx.db
            .query("members")
            .filter((q) => q.eq(q.field("groupId"), args.groupId))
            .collect();

        const categoryMap = new Map(categories.map(c => [c._id, c]));
        const memberMap = new Map(members.map(m => [m._id, m]));

        return expenses.map(expense => ({
            ...expense,
            id: expense._id, // map _id to id for frontend compatibility
            amount: expense.amount.toString(), // convert back to string for frontend
            category: expense.categoryId ? categoryMap.get(expense.categoryId) : undefined,
            handledBy: expense.handledBy ? memberMap.get(expense.handledBy) : undefined,
            participants: expense.participants.map(id => memberMap.get(id)).filter(Boolean),
        }));
    },
});

export const remove = mutation({
    args: { id: v.id("expenses") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        await ctx.db.delete(args.id);
    },
});
