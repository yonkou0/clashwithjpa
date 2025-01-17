import { API_TOKEN, DISCORD_BOT_TOKEN } from "$env/static/private";
import { PUBLIC_API_BASE_URI, PUBLIC_DISCORD_URL } from "$env/static/public";
import type { UserData } from "$lib/auth/user";
import { checkClan, getClanWarData } from "$lib/coc/clan";
import { checkChannel, checkRole, checkUser } from "$lib/discord/check";
import { clanTable, type InsertClan } from "$lib/server/schema";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import type { RequestHandler } from "./$types";

const isAdmin = (user: UserData | null) => user && user.isAdmin;

const handleAddClan = async (locals: any, value: any) => {
    const clanData = await checkClan(PUBLIC_API_BASE_URI, API_TOKEN, value.tag);
    if ("error" in clanData) {
        return { error: "Invalid Clan Tag", status: 400 };
    }
    const clanWarData = await getClanWarData(PUBLIC_API_BASE_URI, API_TOKEN, value.tag);
    if ("error" in clanWarData) {
        return { error: "Unable to fetch data", status: 400 };
    }

    const leader = await checkUser(PUBLIC_DISCORD_URL, DISCORD_BOT_TOKEN, value.leaderID);
    if ("error" in leader) {
        return { error: "Invalid Leader ID", status: 400 };
    }
    const channel = await checkChannel(PUBLIC_DISCORD_URL, DISCORD_BOT_TOKEN, value.channelID);
    if ("error" in channel) {
        return { error: "Invalid Channel ID", status: 400 };
    }

    for (const role of [value.clanRoleID, value.memberRoleID, value.elderRoleID, value.coleaderRoleID, value.leaderRoleID]) {
        if (role) {
            const roleData = await checkRole(PUBLIC_DISCORD_URL, DISCORD_BOT_TOKEN, locals.db, role);
            if ("error" in roleData) {
                const roleNames = {
                    [value.clanRoleID]: "Clan",
                    [value.memberRoleID]: "Member",
                    [value.elderRoleID]: "Elder",
                    [value.coleaderRoleID]: "Co-Leader",
                    [value.leaderRoleID]: "Leader"
                };
                return {
                    error: `Invalid ${roleNames[role]} Role ID`,
                    status: 400
                };
            }
        }
    }

    const dbData: InsertClan = {
        clanCode: value.clanCode,
        clanName: clanData.name,
        clanTag: clanData.tag,
        clanLevel: clanData.clanLevel,
        clanRoleID: value.clanRoleID,
        memberRoleID: value.memberRoleID,
        elderRoleID: value.elderRoleID,
        coleaderRoleID: value.coleaderRoleID,
        leaderRoleID: value.leaderRoleID,
        leaderID: value.leaderID,
        channelID: value.channelID,
        attacksRequirement: value.attacksRequirement,
        donationsRequirement: value.donationsRequirement,
        clangamesRequirement: value.clangamesRequirement,
        clanData: clanData,
        clanCurrentWar: clanWarData
    };
    await locals.db.insert(clanTable).values(dbData);
    return clanData;
};

export const POST: RequestHandler = async ({ locals, request }) => {
    const user = locals.user;
    const body = await request.json();

    if (!isAdmin(user)) {
        return json({ error: "Unauthorized" }, { status: 401 });
    }

    const { key, value } = body;

    if (key === "add_clan") {
        const result = await handleAddClan(locals, value);
        if ("error" in result) {
            return json({ error: result.error }, { status: result.status });
        }
        return json(result);
    }

    return json({ error: "Invalid key" }, { status: 400 });
};

export const DELETE: RequestHandler = async ({ locals, request }) => {
    const user = locals.user;
    const body = await request.json();

    if (!isAdmin(user)) {
        return json({ error: "Unauthorized" }, { status: 401 });
    }

    const { key, value } = body;

    if (key === "remove_clan") {
        await locals.db.delete(clanTable).where(eq(clanTable.clanTag, value));
        return json({ success: true });
    }

    return json({ error: "Invalid key" }, { status: 400 });
};
