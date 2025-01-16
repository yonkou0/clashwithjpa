import { DISCORD_BOT_TOKEN } from "$env/static/private";
import { PUBLIC_DISCORD_URL } from "$env/static/public";
import { getAdminConfig } from "$lib/server/functions";
import type { APIRole, APIUser } from "discord-api-types/v10";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
    const adminConfig = await getAdminConfig(locals.db);

    const adminRolesPromises: Promise<APIRole>[] = adminConfig.adminRolesId.map((roleID: string) =>
        fetch(`${PUBLIC_DISCORD_URL}/guilds/${adminConfig.guildId}/roles/${roleID}`, {
            headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` }
        }).then((resp) => (resp.ok ? (resp.json() as Promise<APIRole>) : Promise.reject(`Failed to fetch role ${roleID}`)))
    );

    const adminsPromises: Promise<APIUser>[] = adminConfig.adminMembersId.map((adminID: string) =>
        fetch(`${PUBLIC_DISCORD_URL}/users/${adminID}`, {
            headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` }
        }).then((resp) => (resp.ok ? (resp.json() as Promise<APIUser>) : Promise.reject(`Failed to fetch user ${adminID}`)))
    );

    const [adminRoles, admins] = await Promise.all([
        Promise.all(adminRolesPromises).catch((err) => {
            console.error(err);
            return [];
        }),
        Promise.all(adminsPromises).catch((err) => {
            console.error(err);
            return [];
        })
    ]);

    return { adminConfig, adminRoles, admins };
}) satisfies PageServerLoad;
