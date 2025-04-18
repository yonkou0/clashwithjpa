import { JWT_SECRET } from "$env/static/private";
import { PUBLIC_DISCORD_URL } from "$env/static/public";
import { verifyData } from "$lib/auth/jwt";
import type { UserData } from "$lib/auth/user";
import { db } from "$lib/server/db";
import { getAdminConfig } from "$lib/server/functions";
import { redirect, type Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { error } from "console";
import type { APIGuild, APIGuildMember } from "discord-api-types/v10";

const handleRefreshHook: Handle = async ({ event, resolve }) => {
    const accessToken: string | undefined = event.cookies.get("access_token");
    const refreshToken: string | undefined = event.cookies.get("refresh_token");

    if (!accessToken && refreshToken && event.url.pathname !== "/auth/refresh") {
        return redirect(307, "/auth/refresh");
    }

    return resolve(event);
};

const setLocalsHook: Handle = async ({ event, resolve }) => {
    const accessToken: string | undefined = event.cookies.get("access_token");
    const user: string | undefined = event.cookies.get("user");

    if (user && accessToken) {
        let data = await verifyData<UserData>(user, JWT_SECRET);

        if (data) {
            // Check if the user in guild & is admin
            const adminConfig = await getAdminConfig(db);
            const guildDataResponse = await fetch(`${PUBLIC_DISCORD_URL}/users/@me/guilds`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (!guildDataResponse.ok) {
                error(guildDataResponse.status, guildDataResponse.statusText);
                data.inGuild = false;
            } else {
                const guildData: APIGuild[] = await guildDataResponse.json();
                data.inGuild = guildData.some((guild: APIGuild) => guild.id === adminConfig.guildId);
            }
            if (data.inGuild) {
                const userGuildDataResponse = await fetch(`${PUBLIC_DISCORD_URL}/users/@me/guilds/${adminConfig.guildId}/member`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                if (!userGuildDataResponse.ok) {
                    error(userGuildDataResponse.status, userGuildDataResponse.statusText);
                    data.isAdmin = false;
                } else {
                    const userGuildData: APIGuildMember = await userGuildDataResponse.json();
                    const adminMembers = adminConfig.adminMembersId;
                    const adminRoles = adminConfig.adminRolesId;
                    data.isAdmin = adminMembers.includes(data.id) || userGuildData.roles.some((roleID: string) => adminRoles.includes(roleID));
                }
            }
        }

        // Assign user data to locals
        event.locals.user = data;
    } else {
        event.locals.user = null;
    }
    event.locals.db = db;

    return resolve(event);
};

export const handle = sequence(handleRefreshHook, setLocalsHook);
