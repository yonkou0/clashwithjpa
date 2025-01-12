import * as schema from "./schema";
import { desc, eq } from "drizzle-orm";
import type { NeonQueryFunction } from "@neondatabase/serverless";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";

type DB = NeonHttpDatabase<Record<string, never>> & {
    $client: NeonQueryFunction<false, false>;
};

export async function createClanApplication(db: DB, data: schema.InsertClanApplication) {
    await db.insert(schema.clanApplicationTable).values(data);
}

export async function getClanApplicationFromTag(db: DB, tag: schema.SelectClanApplication["tag"]) {
    return db.select({ tag: schema.clanApplicationTable.tag }).from(schema.clanApplicationTable).where(eq(schema.clanApplicationTable.tag, tag));
}

export async function getClanApplicationFromDiscordId(db: DB, discordId: schema.SelectClanApplication["discordId"]) {
    return db.select().from(schema.clanApplicationTable).where(eq(schema.clanApplicationTable.discordId, discordId));
}

export async function getClansPublicData(db: DB) {
    return db
        .select({
            clanTag: schema.clanTable.clanTag,
            clanLevel: schema.clanTable.clanLevel,
            attacksRequirement: schema.clanTable.attacksRequirement,
            donationsRequirement: schema.clanTable.donationsRequirement,
            clangamesRequirement: schema.clanTable.clangamesRequirement,
            clanData: schema.clanTable.clanData
        })
        .from(schema.clanTable)
        .orderBy(desc(schema.clanTable.clanLevel));
}

export async function getRules(db: DB) {
    const [rules] = await db.select({ value: schema.settingsTable.value }).from(schema.settingsTable).where(eq(schema.settingsTable.key, "rules"));
    return JSON.parse(JSON.stringify(rules)).value.content;
}

export async function getAdminConfig(db: DB) {
    const [adminRolesId] = await db
        .select({ value: schema.settingsTable.value })
        .from(schema.settingsTable)
        .where(eq(schema.settingsTable.key, "admin_roles_id"));
    const [adminMembersId] = await db
        .select({ value: schema.settingsTable.value })
        .from(schema.settingsTable)
        .where(eq(schema.settingsTable.key, "admin_members_id"));
    const [guildId] = await db
        .select({ value: schema.settingsTable.value })
        .from(schema.settingsTable)
        .where(eq(schema.settingsTable.key, "guild_id"));
    return {
        adminRolesId: JSON.parse(JSON.stringify(adminRolesId)).value,
        adminMembersId: JSON.parse(JSON.stringify(adminMembersId)).value,
        guildId: JSON.parse(JSON.stringify(guildId)).value
    };
}

export async function insertSettings(db: DB, key: schema.InsertSettings["key"], value: schema.InsertSettings["value"]) {
    await db.insert(schema.settingsTable).values({ key, value });
}
