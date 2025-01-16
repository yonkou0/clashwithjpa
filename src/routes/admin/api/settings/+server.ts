import { DISCORD_BOT_TOKEN } from "$env/static/private";
import { PUBLIC_DISCORD_URL } from "$env/static/public";
import { checkGuild, checkRole, checkUser } from "$lib/discord/check";
import { getAdminConfig } from "$lib/server/functions";
import { settingsTable } from "$lib/server/schema";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import type { RequestHandler } from "./$types";

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
        guildData = await checkGuild(PUBLIC_DISCORD_URL, DISCORD_BOT_TOKEN, value.id);
        if ("error" in guildData) {
            return json({ error: "Invalid Guild ID" }, { status: 400 });
        }
    }

    // Check and add admin role
    let roleData = null;
    if (key === "add_admin_role_id") {
        roleData = await checkRole(PUBLIC_DISCORD_URL, DISCORD_BOT_TOKEN, locals.db, value);
        if ("error" in roleData) {
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
        userData = await checkUser(PUBLIC_DISCORD_URL, DISCORD_BOT_TOKEN, value);
        if ("error" in userData) {
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

    // Remove admin role
    if (key === "remove_admin_role_id") {
        const newAdminRolesId = adminConfig.adminRolesId.filter((id: string) => id !== value);
        await locals.db.update(settingsTable).set({ value: newAdminRolesId }).where(eq(settingsTable.key, "admin_roles_id"));
        return json({ success: true });
    }

    // Remove admin member
    if (key === "remove_admin_id") {
        const newAdminMembersId = adminConfig.adminMembersId.filter((id: string) => id !== value);
        await locals.db.update(settingsTable).set({ value: newAdminMembersId }).where(eq(settingsTable.key, "admin_members_id"));
        return json({ success: true });
    }

    return json({ error: "Invalid key" }, { status: 400 });
};
