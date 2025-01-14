import { DISCORD_BOT_TOKEN } from "$env/static/private";
import { PUBLIC_DISCORD_URL } from "$env/static/public";
import { getAdminConfig } from "$lib/server/functions";
import type { APIRole, APIUser } from "discord-api-types/v10";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
    const adminConfig = await getAdminConfig(locals.db);
    const adminRoles: APIRole[] = [];
    for (const roleID of adminConfig.adminRolesId) {
        const resp = await fetch(`${PUBLIC_DISCORD_URL}/guilds/${adminConfig.guildId}/roles/${roleID}`, {
            headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` }
        });
        if (resp.ok) {
            const role = await resp.json();
            adminRoles.push(role);
        }
    }

    const admins: APIUser[] = [];
    for (const adminID of adminConfig.adminMembersId) {
        const resp = await fetch(`${PUBLIC_DISCORD_URL}/users/${adminID}`, {
            headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` }
        });
        if (resp.ok) {
            const user = await resp.json();
            admins.push(user);
        }
    }

    return { adminConfig, adminRoles, admins };
}) satisfies PageServerLoad;
