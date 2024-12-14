import { redirect, type Handle } from "@sveltejs/kit";
import { getUserData, logout, refreshSession, type UserData } from "$lib/auth/sessionHelper";

export const handle = (async ({ event, resolve }) => {
    const userCookies: string | null = event.cookies.get("user") || null;
    const accessToken: string | null = event.cookies.get("access_token") || null;
    const refreshToken: string | null = event.cookies.get("refresh_token") || null;
    let user: UserData | null;

    if (userCookies) {
        user = JSON.parse(userCookies) as UserData;
    } else if (accessToken) {
        user = await getUserData(accessToken, event.cookies);
    } else if (refreshToken) {
        user = await refreshSession(refreshToken, event.cookies);
    } else {
        user = null;
    }
    event.locals.user = user;

    if (event.url.pathname.startsWith("/cwl")) {
        if (!event.locals.user) throw redirect(303, "/login");
    }
    if (event.url.pathname.startsWith("/auth/logout")) {
        event.locals.user = null;
        logout(event.cookies);
        return await redirect(303, "/");
    }

    return await resolve(event);
}) satisfies Handle;
