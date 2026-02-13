import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const me = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;
        return await ctx.db.get(userId);
    },
});

export const update = mutation({
    args: {
        name: v.optional(v.string()),
        isOnboarded: v.optional(v.boolean()),
        // Add other fields if necessary, currently 'name' is standard in auth users
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const data: { name?: string; isOnboarded?: boolean } = {};
        if (args.name !== undefined) data.name = args.name;
        if (args.isOnboarded !== undefined) data.isOnboarded = args.isOnboarded;

        await ctx.db.patch(userId, data);

        // Sync name to members if name is updated
        if (args.name) {
            const members = await ctx.db
                .query("members")
                .filter((q) => q.eq(q.field("profileId"), userId))
                .collect();

            for (const member of members) {
                await ctx.db.patch(member._id, { name: args.name });
            }
        }
    },
});
