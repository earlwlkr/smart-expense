import type { Doc } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";

type MemberDoc = Doc<"members">;
type UserDoc = Doc<"users"> | null;
type DbCtx = Pick<QueryCtx | MutationCtx, "db">;

export function getPreferredUserName(user: UserDoc) {
    const trimmedName = user?.name?.trim();
    if (trimmedName) return trimmedName;

    const trimmedEmail = user?.email?.trim();
    if (trimmedEmail) return trimmedEmail;

    return undefined;
}

export async function resolveMemberNamesFromProfiles<T extends MemberDoc>(
    ctx: DbCtx,
    members: T[],
): Promise<T[]> {
    const profileIds = members.reduce<Doc<"users">["_id"][]>((ids, member) => {
        if (member.profileId && !ids.includes(member.profileId)) {
            ids.push(member.profileId);
        }

        return ids;
    }, []);

    if (profileIds.length === 0) {
        return members;
    }

    const users = await Promise.all(profileIds.map((profileId) => ctx.db.get(profileId)));
    const userMap = new Map<Doc<"users">["_id"], UserDoc>();

    profileIds.forEach((profileId, index) => {
        userMap.set(profileId, users[index] ?? null);
    });

    return members.map((member) => {
        const preferredName = member.profileId ? getPreferredUserName(userMap.get(member.profileId) ?? null) : undefined;

        if (!preferredName || preferredName === member.name) {
            return member;
        }

        return {
            ...member,
            name: preferredName,
        };
    });
}
