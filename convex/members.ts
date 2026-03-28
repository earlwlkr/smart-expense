import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { getPreferredUserName, resolveMemberNamesFromProfiles } from "./memberNames";

export const create = mutation({
    args: {
        name: v.string(),
        groupId: v.id("groups"),
        profileId: v.optional(v.id("users"))
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const linkedUser = args.profileId ? await ctx.db.get(args.profileId) : null;
        const resolvedName = getPreferredUserName(linkedUser) ?? args.name;

        const memberId = await ctx.db.insert("members", {
            name: resolvedName,
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

        const members = await ctx.db
            .query("members")
            .filter((q) => q.eq(q.field("groupId"), args.groupId))
            .collect();

        return await resolveMemberNamesFromProfiles(ctx, members);
    },
});

export const update = mutation({
    args: { id: v.id("members"), name: v.string() },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const member = await ctx.db.get(args.id);
        if (!member) throw new Error("Member not found");

        await ctx.db.patch(args.id, { name: args.name });

        if (member.profileId && member.profileId === userId) {
            await ctx.db.patch(userId, { name: args.name });
        }
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
