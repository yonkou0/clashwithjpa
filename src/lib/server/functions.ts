import * as schema from "$lib/server/schema";
import type { NeonQueryFunction } from "@neondatabase/serverless";
import { and, desc, eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";

export type DB = NeonHttpDatabase<typeof schema> & {
    $client: NeonQueryFunction<false, false>;
};

export async function isApplicationEnabled(db: DB) {
    const status = await db.query.settingsTable.findFirst({
        where: eq(schema.settingsTable.key, "applications_enabled")
    });
    return status?.value as boolean;
}

export async function isCWLEnabled(db: DB) {
    const status = await db.query.settingsTable.findFirst({
        where: eq(schema.settingsTable.key, "cwl_enabled")
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
        adminRolesId: adminRolesId?.value as string[],
        adminMembersId: adminMembersId?.value as string[],
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

export async function getAllCWLApplications(db: DB) {
    return db.query.cwlTable.findMany();
}

export async function getCWLApplications(db: DB, discordId: schema.SelectCWL["userId"]) {
    return db.query.cwlTable.findMany({
        where: eq(schema.cwlTable.userId, discordId)
    });
}

export async function getCWLApplicationByTag(db: DB, tag: schema.SelectCWL["accountTag"], month: string, year: number) {
    return db.query.cwlTable.findFirst({
        where: and(eq(schema.cwlTable.accountTag, tag), eq(schema.cwlTable.month, month), eq(schema.cwlTable.year, year))
    });
}

export async function insertCWLApplication(db: DB, data: schema.InsertCWL) {
    await db.insert(schema.cwlTable).values(data);
}
