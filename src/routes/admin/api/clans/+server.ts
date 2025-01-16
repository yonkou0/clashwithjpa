import { API_TOKEN } from "$env/static/private";
import { PUBLIC_API_BASE_URI } from "$env/static/public";
import type { APIClan, APIClanWar, APIWarClan } from "$lib/coc/types";
import { clanTable, type InsertClan } from "$lib/server/schema";
import type { NeonQueryFunction } from "@neondatabase/serverless";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import type { RequestHandler } from "./$types";

type DB = NeonHttpDatabase<Record<string, never>> & {
    $client: NeonQueryFunction<false, false>;
};

export const POST: RequestHandler = async ({ locals, request }) => {
    const user = locals.user;
    const body = await request.json();

    // Check if user is an admin
    if (!user || !user.isAdmin) {
        return json({ error: "Unauthorized" }, { status: 401 });
    }

    const { key, value } = body;

    // Check and add clan
    let clanData: APIClan | null | { error: boolean } = null;
    if (key === "add_clan") {
        clanData = await checkClan(value.tag);
        if ("error" in clanData) {
            return json({ error: "Invalid Clan ID" }, { status: 400 });
        } else {
            const clanWarData: APIClanWar | { error: boolean } = await getClanWarData(value.tag);
            if ("error" in clanWarData) {
                return json({ error: "Unable to fetch data" }, { status: 400 });
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
            return json(clanData);
        }
    }

    return json({ error: "Invalid key" }, { status: 400 });
};

export const DELETE: RequestHandler = async ({ locals, request }) => {
    const user = locals.user;
    const body = await request.json();

    // Check if user is an admin
    if (!user || !user.isAdmin) {
        return json({ error: "Unauthorized" }, { status: 401 });
    }

    const { key, value } = body;

    // Remove clan
    if (key === "remove_clan") {
        await locals.db.delete(clanTable).where(eq(clanTable.clanTag, value));
        return json({ success: true });
    }

    return json({ error: "Invalid key" }, { status: 400 });
};

// Clan check func
async function checkClan(tag: string) {
    const resp = await fetch(`${PUBLIC_API_BASE_URI}/clans/${tag}`, {
        headers: {
            Authorization: `Bearer ${API_TOKEN}`
        }
    });
    if (!resp.ok) {
        return { error: true };
    }
    return (await resp.json()) as APIClan;
}

// Get clan war data
async function getClanWarData(tag: string) {
    const resp = await fetch(`${PUBLIC_API_BASE_URI}/clans/${tag}/currentwar`, {
        headers: {
            Authorization: `Bearer ${API_TOKEN}`
        }
    });
    if (!resp.ok) {
        return { error: true };
    }
    return await resp.json();
}
