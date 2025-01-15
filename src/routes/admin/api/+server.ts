import { DISCORD_BOT_TOKEN } from "$env/static/private";
import { PUBLIC_DISCORD_URL } from "$env/static/public";
import { getAdminConfig } from "$lib/server/functions";
import { settingsTable } from "$lib/server/schema";
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
    const adminConfig = await getAdminConfig(locals.db);

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

    // Check and add admin role
    let roleData = null;
    if (key === "add_admin_role_id") {
        roleData = await checkRole(locals.db, value);
        if (roleData.error) {
            return json({ error: "Invalid Role ID" }, { status: 400 });
        } else {
            const newAdminRolesId = adminConfig.adminRolesId.concat(value);
            await locals.db.update(settingsTable).set({ value: newAdminRolesId }).where(eq(settingsTable.key, "admin_roles_id"));
            return json(roleData);
        }
    }

    // Check and add admin member
    let userData = null;
    if (key === "add_admin_id") {
        userData = await checkUser(value);
        if (userData.error) {
            return json({ error: "Invalid User ID" }, { status: 400 });
        } else {
            const newAdminMembersId = adminConfig.adminMembersId.concat(value);
            await locals.db.update(settingsTable).set({ value: newAdminMembersId }).where(eq(settingsTable.key, "admin_members_id"));
            return json(userData);
        }
    }

    // Update settings table
    await locals.db.update(settingsTable).set({ value: value }).where(eq(settingsTable.key, key));

    // Return guild data if key is "guild_id"
    if (key === "guild_id" && guildData) {
        return json(guildData);
    }
    return json({ success: true });
};

export const DELETE: RequestHandler = async ({ locals, request }) => {
    const user = locals.user;
    const body = await request.json();
    let adminConfig = await getAdminConfig(locals.db);

    // Check if user is an admin
    if (!user || !user.isAdmin) {
        return json({ error: "Unauthorized" }, { status: 401 });
    }

    const { key, value } = body;

    // Check and remove admin role
    if (key === "remove_admin_role_id") {
        const newAdminRolesId = adminConfig.adminRolesId.filter((id: string) => id !== value);
        await locals.db.update(settingsTable).set({ value: newAdminRolesId }).where(eq(settingsTable.key, "admin_roles_id"));
        return json({ success: true });
    }

    // Check and remove admin member
    if (key === "remove_admin_id") {
        const newAdminMembersId = adminConfig.adminMembersId.filter((id: string) => id !== value);
        await locals.db.update(settingsTable).set({ value: newAdminMembersId }).where(eq(settingsTable.key, "admin_members_id"));
        return json({ success: true });
    }

    return json({ error: "Invalid key" }, { status: 400 });
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

// User check func
async function checkUser(id: string) {
    const resp = await fetch(`${PUBLIC_DISCORD_URL}/users/${id}`, {
        headers: {
            Authorization: `Bot ${DISCORD_BOT_TOKEN}`
        }
    });
    if (!resp.ok) {
        return { error: true };
    }
    return await resp.json();
}
