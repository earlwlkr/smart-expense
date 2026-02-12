import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getInviteToken = query({
    args: { groupId: v.id("groups") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("invite_tokens")
            .withIndex("by_groupId", (q) => q.eq("groupId", args.groupId))
            .first();
    },
});

export const getByToken = query({
    args: { token: v.string(), type: v.union(v.literal("invite"), v.literal("share")) },
    handler: async (ctx, args) => {
        const table = args.type === "invite" ? "invite_tokens" : "share_tokens";
        return await ctx.db
            .query(table)
            .withIndex("by_token", (q) => q.eq("token", args.token))
            .unique();
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

export const joinGroupWithToken = mutation({
    args: { token: v.string() },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const tokenDoc = await ctx.db
            .query("invite_tokens")
            .withIndex("by_token", (q) => q.eq("token", args.token))
            .unique();

        if (!tokenDoc || tokenDoc.disabled) {
            throw new Error("Invalid or disabled token");
        }

        // Check if user is already a member
        const existingMember = await ctx.db
            .query("members")
            .filter((q) => q.and(
                q.eq(q.field("groupId"), tokenDoc.groupId),
                q.eq(q.field("profileId"), userId)
            ))
            .first();

        if (!existingMember) {
            // Get user to get their name
            const user = await ctx.db.get(userId);
            await ctx.db.insert("members", {
                groupId: tokenDoc.groupId,
                profileId: userId,
                name: (user as any)?.name || "New Member",
            });
        }

        // Disable token after use
        await ctx.db.patch(tokenDoc._id, { disabled: true });

        return tokenDoc.groupId;
    },
});
