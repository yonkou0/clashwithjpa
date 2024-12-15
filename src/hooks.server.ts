import { redirect, type Handle } from "@sveltejs/kit";
import { getUserData, refreshSession } from "$lib/auth/sessionHelper";

export const handle = (async ({ event, resolve }) => {
    const accessToken: string | null = event.cookies.get("access_token") || null;
    const refreshToken: string | null = event.cookies.get("refresh_token") || null;

    if (accessToken) {
        event.locals.user = await getUserData(accessToken);
    } else if (refreshToken) {
        event.locals.user = await refreshSession(refreshToken, event.cookies);
    } else {
        event.locals.user = null;
    }

    if (event.url.pathname.startsWith("/cwl") && !event.locals.user) {
        throw redirect(303, "/auth/login");
    }

    return await resolve(event);
}) satisfies Handle;
