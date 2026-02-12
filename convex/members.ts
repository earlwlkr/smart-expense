import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
    args: {
        name: v.string(),
        groupId: v.id("groups"),
        profileId: v.optional(v.id("users"))
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const memberId = await ctx.db.insert("members", {
            name: args.name,
            groupId: args.groupId,
            profileId: args.profileId,
        });
        return memberId;
    },
});

export const list = query({
    args: { groupId: v.id("groups") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];

        return await ctx.db
            .query("members")
            .filter((q) => q.eq(q.field("groupId"), args.groupId))
            .collect();
    },
});

export const update = mutation({
    args: { id: v.id("members"), name: v.string() },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        await ctx.db.patch(args.id, { name: args.name });
    },
});

export const remove = mutation({
    args: { id: v.id("members") },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        await ctx.db.delete(args.id);
    },
});
