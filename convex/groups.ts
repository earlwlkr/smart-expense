import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
    args: { name: v.string() },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const groupId = await ctx.db.insert("groups", {
            name: args.name,
            created_at: Date.now(),
            createdBy: userId,
        });
        return groupId;
    },
});

export const list = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];

        // For now, returning all groups. 
        // In a real app, you'd filter by membership.
        return await ctx.db.query("groups").order("desc").collect();
    },
});

export const get = query({
    args: { id: v.id("groups") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;
        return await ctx.db.get(args.id);
    },
});
