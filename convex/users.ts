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
        // Add other fields if necessary, currently 'name' is standard in auth users
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        await ctx.db.patch(userId, {
            ...(args.name !== undefined ? { name: args.name } : {}),
        });
    },
});
