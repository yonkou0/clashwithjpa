import { PUBLIC_DISCORD_URL } from "$env/static/public";
import { error } from "@sveltejs/kit";
import type { APIGuild, APIGuildMember, APIUser } from "discord-api-types/v10";
import { getAdminConfig } from "$lib/server/functions";
import type { NeonQueryFunction } from "@neondatabase/serverless";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "$lib/server/schema";

type DB = NeonHttpDatabase<typeof schema> & {
    $client: NeonQueryFunction<false, false>;
}

export type UserData = APIUser & { inGuild: boolean; isAdmin: boolean };

export async function getUserData(access_token: string, db: DB): Promise<UserData> {
    const userDataResponse = await fetch(`${PUBLIC_DISCORD_URL}/users/@me`, {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    });
    if (!userDataResponse.ok) {
        error(userDataResponse.status, userDataResponse.statusText);
    }
    const userData: UserData = await userDataResponse.json();
    const guildDataResponse = await fetch(`${PUBLIC_DISCORD_URL}/users/@me/guilds`, {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    });
    if (!guildDataResponse.ok) {
        error(guildDataResponse.status, guildDataResponse.statusText);
    }
    const guildData: APIGuild[] = await guildDataResponse.json();
    const adminConfig = await getAdminConfig(db);

    userData.inGuild = guildData.some((guild: APIGuild) => guild.id === adminConfig.guildId);
    if (userData.inGuild) {
        const userGuildDataResponse = await fetch(`${PUBLIC_DISCORD_URL}/users/@me/guilds/${adminConfig.guildId}/member`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        if (!userGuildDataResponse.ok) {
            error(userGuildDataResponse.status, userGuildDataResponse.statusText);
        }
        const userGuildData: APIGuildMember = await userGuildDataResponse.json();

        const adminMembers = adminConfig.adminMembersId;
        const adminRoles = adminConfig.adminRolesId;

        userData.isAdmin = adminMembers.includes(userData.id) || userGuildData.roles.some((roleID: string) => adminRoles.includes(roleID));
    }
    return userData;
}
