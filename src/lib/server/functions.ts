import type { NeonQueryFunction } from "@neondatabase/serverless";
import { desc, eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "$lib/server/schema";

type DB = NeonHttpDatabase<typeof schema> & {
    $client: NeonQueryFunction<false, false>;
};

export async function isApplicationEnabled(db: DB) {
    const status = await db.query.settingsTable.findFirst({
        where: eq(schema.settingsTable.key, "applications_enabled")
    });
    return status?.value as boolean;
}

export async function createClanApplication(db: DB, data: schema.InsertClanApplication) {
    await db.insert(schema.clanApplicationTable).values(data);
}

export async function getApplications(db: DB) {
    return db.query.clanApplicationTable.findMany();
}

export async function getClanApplicationFromTag(db: DB, tag: schema.SelectClanApplication["tag"]) {
    return db.query.clanApplicationTable.findFirst({
        where: eq(schema.clanApplicationTable.tag, tag)
    });
}

export async function getClanApplicationFromDiscordId(db: DB, discordId: schema.SelectClanApplication["discordId"]) {
    return db.query.clanApplicationTable.findMany({
        where: eq(schema.clanApplicationTable.discordId, discordId)
    });
}

export async function acceptApplication(db: DB, tag: schema.SelectClanApplication["tag"], discordId: schema.SelectUser["discordId"]) {
    await db.update(schema.clanApplicationTable).set({ status: "accepted" }).where(eq(schema.clanApplicationTable.tag, tag));
    await db.insert(schema.userTable).values({ discordId: discordId });
    await db.insert(schema.cocTable).values({ userId: discordId, tag: tag });
}

export async function rejectApplication(db: DB, tag: schema.SelectClanApplication["tag"]) {
    await db.update(schema.clanApplicationTable).set({ status: "rejected" }).where(eq(schema.clanApplicationTable.tag, tag));
}

export async function getClansPublicData(db: DB) {
    return db.query.clanTable.findMany({
        orderBy: desc(schema.clanTable.clanLevel),
        columns: {
            clanTag: true,
            clanLevel: true,
            attacksRequirement: true,
            donationsRequirement: true,
            clangamesRequirement: true,
            clanData: true
        }
    });
}

export async function getRules(db: DB) {
    const rules = await db.query.settingsTable.findFirst({
        where: eq(schema.settingsTable.key, "rules")
    });
    return JSON.parse(JSON.stringify(rules)).value;
}

export async function getAdminConfig(db: DB) {
    // const [adminRolesId] = await db
    //     .select({ value: schema.settingsTable.value })
    //     .from(schema.settingsTable)
    //     .where(eq(schema.settingsTable.key, "admin_roles_id"));
    // const [adminMembersId] = await db
    //     .select({ value: schema.settingsTable.value })
    //     .from(schema.settingsTable)
    //     .where(eq(schema.settingsTable.key, "admin_members_id"));
    // const [guildId] = await db
    //     .select({ value: schema.settingsTable.value })
    //     .from(schema.settingsTable)
    //     .where(eq(schema.settingsTable.key, "guild_id"));
    // return {
    //     adminRolesId: JSON.parse(JSON.stringify(adminRolesId)).value,
    //     adminMembersId: JSON.parse(JSON.stringify(adminMembersId)).value,
    //     guildId: JSON.parse(JSON.stringify(guildId)).value.id
    // };

    const adminRolesId = await db.query.settingsTable.findFirst({
        where: eq(schema.settingsTable.key, "admin_roles_id")
    });
    const adminMembersId = await db.query.settingsTable.findFirst({
        where: eq(schema.settingsTable.key, "admin_members_id")
    });
    const guildId = await db.query.settingsTable.findFirst({
        where: eq(schema.settingsTable.key, "guild_id")
    });

    return {
        adminRolesId: adminMembersId?.value as string[],
        adminMembersId: adminRolesId?.value as string[],
        // @ts-expect-error annoying
        guildId: guildId?.value.id as string
    };
}

export async function getUserAccounts(db: DB, discordId: schema.SelectUser["discordId"]) {
    return db.query.userTable.findFirst({
        where: eq(schema.userTable.discordId, discordId),
        with: {
            cocAccounts: true
        }
    });
}
