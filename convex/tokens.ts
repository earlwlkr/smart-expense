import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getInviteToken = query({
    args: { groupId: v.id("groups") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("invite_tokens")
            .withIndex("by_groupId", (q) => q.eq("groupId", args.groupId))
            .first();
    },
});

export const getShareToken = query({
    args: { groupId: v.id("groups") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("share_tokens")
            .withIndex("by_groupId", (q) => q.eq("groupId", args.groupId))
            .first();
    },
});

export const createInviteToken = mutation({
    args: { groupId: v.id("groups") },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("invite_tokens")
            .withIndex("by_groupId", (q) => q.eq("groupId", args.groupId))
            .first();
        if (existing) return existing._id;
        return await ctx.db.insert("invite_tokens", {
            groupId: args.groupId,
            token: crypto.randomUUID(),
            disabled: false,
        });
    },
});

export const createShareToken = mutation({
    args: { groupId: v.id("groups") },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("share_tokens")
            .withIndex("by_groupId", (q) => q.eq("groupId", args.groupId))
            .first();
        if (existing) return existing._id;
        return await ctx.db.insert("share_tokens", {
            groupId: args.groupId,
            token: crypto.randomUUID(),
            disabled: false,
        });
    },
});

export const toggleInviteToken = mutation({
    args: { id: v.id("invite_tokens"), disabled: v.boolean() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { disabled: args.disabled });
    },
});

export const toggleShareToken = mutation({
    args: { id: v.id("share_tokens"), disabled: v.boolean() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { disabled: args.disabled });
    },
});
