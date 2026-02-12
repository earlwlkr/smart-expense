import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
    ...authTables,
    groups: defineTable({
        name: v.string(),
        created_at: v.optional(v.number()),
        createdBy: v.optional(v.id("users")),
    }),
    categories: defineTable({
        name: v.string(),
        groupId: v.id("groups"),
    }),
    members: defineTable({
        name: v.string(),
        groupId: v.id("groups"),
        profileId: v.optional(v.id("users")), // Link to authenticated user if they joined
    }),
    expenses: defineTable({
        name: v.string(),
        amount: v.number(),
        date: v.string(), // ISO string
        groupId: v.id("groups"),
        categoryId: v.optional(v.id("categories")),
        handledBy: v.optional(v.id("members")),
        participants: v.array(v.id("members")),
        createdAt: v.optional(v.number()),
    })
        .index("by_groupId", ["groupId"])
        .index("by_date", ["date"]),
    invite_tokens: defineTable({
        groupId: v.id("groups"),
        token: v.string(),
        disabled: v.boolean(),
        expiration: v.optional(v.number()),
    }).index("by_groupId", ["groupId"]).index("by_token", ["token"]),
    share_tokens: defineTable({
        groupId: v.id("groups"),
        token: v.string(),
        disabled: v.boolean(),
        expiration: v.optional(v.number()),
    }).index("by_groupId", ["groupId"]).index("by_token", ["token"]),
});
