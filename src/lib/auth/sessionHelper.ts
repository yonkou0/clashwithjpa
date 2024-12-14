import { DISCORD_ID, DISCORD_SECRET } from "$env/static/private";
import { PUBLIC_DISCORD_URL } from "$env/static/public";
import type { APIGuild, APIGuildMember, APIUser, RESTPostOAuth2AccessTokenResult } from "discord-api-types/v10";
import axios from "axios";
import cookie from "cookie";
import { error, type Cookies } from "@sveltejs/kit";
import info from "../../../data/info.json";

export async function getAuthForm(code: string, url: URL): Promise<URLSearchParams> {
    return new URLSearchParams({
        client_id: DISCORD_ID,
        client_secret: DISCORD_SECRET,
        grant_type: "authorization_code",
        code: code.toString(),
        redirect_uri: `${url.origin}/auth/callback`
    });
}

export async function getRefreshForm(refresh_token: string): Promise<URLSearchParams> {
    return new URLSearchParams({
        client_id: DISCORD_ID,
        client_secret: DISCORD_SECRET,
        grant_type: "refresh_token",
        refresh_token
    });
}

export interface GuildInfo {
    inGuild: boolean;
    isAdmin: boolean;
}
export type UserData = APIUser & GuildInfo;

export class CookieHelper {
    static getUserCookie() {
        const name: string = "user";
        const opts: cookie.SerializeOptions & { path: string } = {
            path: "/",
            httpOnly: true,
            sameSite: false,
            maxAge: 10 * 60 * 1000 // 10 minutes
        };
        return { name, opts };
    }

    static getAccessCookie() {
        const name: string = "access_token";
        const opts: cookie.SerializeOptions & { path: string } = {
            path: "/",
            httpOnly: true,
            sameSite: false,
            maxAge: 10 * 24 * 60 * 60 * 1000 // 10 days
        };
        return { name, opts };
    }

    static getRefreshCookie() {
        const name: string = "refresh_token";
        const opts: cookie.SerializeOptions & { path: string } = {
            path: "/",
            httpOnly: true,
            sameSite: false,
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        };
        return { name, opts };
    }
}

export async function getUserData(access_token: string, cookies: Cookies): Promise<UserData> {
    const userData: UserData = await axios
        .get(`${PUBLIC_DISCORD_URL}/users/@me`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })
        .catch((err) => error(err.status, err.statusText))
        .then((res) => res.data);
    const guildData: APIGuild[] = await axios
        .get(`${PUBLIC_DISCORD_URL}/users/@me/guilds`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })
        .catch((err) => error(err.status, err.statusText))
        .then((res) => res.data);
    // Info JSON data
    const infoData: { [key: string]: string } = JSON.parse(JSON.stringify(info));
    // Check if user is in guild
    userData.inGuild = guildData.some((guild: APIGuild) => guild.id == infoData.guildID);
    // If user is in guild, check if they are an admin
    if (userData.inGuild) {
        const userGuildData: APIGuildMember = await axios
            .get(`${PUBLIC_DISCORD_URL}/users/@me/guilds/1029993902503108678/member`, {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })
            .catch((err) => error(err.status, err.statusText))
            .then((res) => res.data);
        userData.isAdmin = userGuildData.roles.some((roleID: string) => roleID == infoData.adminRoleID);
    }
    const { name: userName, opts: userOpts } = CookieHelper.getUserCookie();
    cookies.set(userName, JSON.stringify(userData), userOpts);

    return userData;
}

async function postOAuthToken(formData: URLSearchParams): Promise<RESTPostOAuth2AccessTokenResult> {
    const authRes = await axios.post(`${PUBLIC_DISCORD_URL}/oauth2/token`, formData.toString(), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
    return authRes.data as RESTPostOAuth2AccessTokenResult;
}

export async function getSessionCookies(code: string, url: URL): Promise<{ accessCookie: string; refreshCookie: string }> {
    const formData = await getAuthForm(code, url);
    const accessData = await postOAuthToken(formData);
    const { name: accessName, opts: accessOpt } = CookieHelper.getAccessCookie();
    const { name: refreshName, opts: refreshOpt } = CookieHelper.getRefreshCookie();
    return {
        accessCookie: cookie.serialize(accessName, accessData.access_token as string, accessOpt),
        refreshCookie: cookie.serialize(refreshName, accessData.refresh_token as string, refreshOpt)
    };
}

export async function refreshSession(refresh_token: string, cookies: Cookies): Promise<UserData> {
    const formData = await getRefreshForm(refresh_token);
    const accessData = await postOAuthToken(formData);

    const { name: accessName, opts: accessOpt } = CookieHelper.getAccessCookie();
    const { name: refreshName, opts: refreshOpt } = CookieHelper.getRefreshCookie();

    const accessToken = accessData.access_token as string;
    const refreshToken = accessData.refresh_token as string;

    cookies.set(accessName, accessToken, accessOpt);
    cookies.set(refreshName, refreshToken, refreshOpt);

    return await getUserData(accessToken, cookies);
}

export async function logout(cookies: Cookies): Promise<void> {
    const { name: userName, opts: userOpt } = CookieHelper.getUserCookie();
    const { name: accessName, opts: accessOpt } = CookieHelper.getAccessCookie();
    const { name: refreshName, opts: refreshOpt } = CookieHelper.getRefreshCookie();
    cookies.set(userName, "", { ...userOpt, maxAge: -1 });
    cookies.set(accessName, "", { ...accessOpt, maxAge: -1 });
    cookies.set(refreshName, "", { ...refreshOpt, maxAge: -1 });
}
