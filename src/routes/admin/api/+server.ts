import { DISCORD_BOT_TOKEN } from "$env/static/private";
import { PUBLIC_DISCORD_URL } from "$env/static/public";
import { settingsTable } from "$lib/server/schema";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import type { RequestHandler } from "./$types";
import { getAdminConfig } from "$lib/server/functions";
import type { NeonQueryFunction } from "@neondatabase/serverless";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";

type DB = NeonHttpDatabase<Record<string, never>> & {
    $client: NeonQueryFunction<false, false>;
};

export const POST: RequestHandler = async ({ locals, request }) => {
    const user = locals.user;
    const body = await request.json();
    let adminConfig = await getAdminConfig(locals.db);

    // Check if user is an admin
    if (!user || !user.isAdmin) {
        return json({ error: "Unauthorized" }, { status: 401 });
    }

    const { key, value } = body;

    // Check if guild_id is valid (if key is "guild_id")
    let guildData = null;
    if (key === "guild_id") {
        guildData = await checkGuild(value.id);
        if (guildData.error) {
            return json({ error: "Invalid Guild ID" }, { status: 400 });
        }
    }

    // Check and add role_id to settings if key is "add_admin_role_id"
    let roleData = null;
    if (key === "add_admin_role_id") {
        roleData = await checkRole(locals.db, value);
        if (roleData.error) {
            return json({ error: "Invalid Role ID" }, { status: 400 });
        } else {
            const newAdminRolesId = adminConfig.adminRolesId.concat(value);
            console.log(newAdminRolesId);
            await locals.db
                .update(settingsTable)
                .set({ value: newAdminRolesId })
                .where(eq(settingsTable.key, "admin_roles_id"));
            return json(roleData);
        }
    } else if (key === "remove_admin_role_id") {
        const newAdminRolesId = adminConfig.adminRolesId.filter((id: string) => id !== value);
        await locals.db
            .update(settingsTable)
            .set({ value: newAdminRolesId })
            .where(eq(settingsTable.key, "admin_roles_id"));
        return json({ success: true });
    }

    // Update settings table
    await locals.db.update(settingsTable).set({ value: value }).where(eq(settingsTable.key, key));

    // Return guild data if key is "guild_id"
    if (key === "guild_id" && guildData) {
        return json(guildData);
    }
    return json({ success: true });
};

// Guild check func
async function checkGuild(id: string) {
    const resp = await fetch(`${PUBLIC_DISCORD_URL}/guilds/${id}`, {
        headers: {
            Authorization: `Bot ${DISCORD_BOT_TOKEN}`
        }
    });
    if (!resp.ok) {
        return { error: true };
    }
    return await resp.json();
}

// Role check func
async function checkRole(db: DB, role: string) {
    const adminConfig = await getAdminConfig(db);
    const resp = await fetch(`${PUBLIC_DISCORD_URL}/guilds/${adminConfig.guildId}/roles/${role}`, {
        headers: {
            Authorization: `Bot ${DISCORD_BOT_TOKEN}`
        }
    });
    if (!resp.ok) {
        return { error: true };
    }
    return await resp.json();
}
