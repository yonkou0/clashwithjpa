import { PUBLIC_DISCORD_URL } from "$env/static/public";
import { error } from "@sveltejs/kit";
import type { APIUser } from "discord-api-types/v10";

export type UserData = APIUser;

export async function getUserData(access_token: string): Promise<UserData> {
    const userDataResponse = await fetch(`${PUBLIC_DISCORD_URL}/users/@me`, {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    });
    if (!userDataResponse.ok) {
        error(userDataResponse.status, userDataResponse.statusText);
    }
    const userData: UserData = await userDataResponse.json();
    return userData;
}
