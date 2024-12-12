import { redirect, type Handle } from "@sveltejs/kit";
import { getUserData, refreshSession } from "$lib/auth/sessionHelper";

export const handle = (async ({ event, resolve }) => {
    const access_token = event.cookies.get("access_token");
    const refresh_token = event.cookies.get("refresh_token");

    if (access_token) {
        const userData = await getUserData(access_token);
        event.locals.user = userData;
    } else if (refresh_token) {
        const userData = await refreshSession(refresh_token, event.cookies);
        event.locals.user = userData;
    } else {
        event.locals.user = null;
    }

    if (event.url.pathname.startsWith("/cwl")) {
        if (!event.locals.user) throw redirect(303, "/login");
    }

    return await resolve(event);
}) satisfies Handle;
