import { redirect } from "@sveltejs/kit";
import type { Handle } from "@sveltejs/kit";
import { getUserData } from "$lib/auth/user";

export const handle: Handle = async ({ event, resolve }) => {
    let accessToken: string | null = event.cookies.get("access_token") || null;
    const refreshToken: string | null = event.cookies.get("refresh_token") || null;

    if (accessToken) {
        event.locals.user = await getUserData(accessToken);
    } else if (refreshToken) {
        await fetch(`/auth/refresh`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ refresh_token: refreshToken }) })
        accessToken = event.cookies.get("access_token") || null;
        if (accessToken) {
            event.locals.user = await getUserData(accessToken);
        } else {
            throw redirect(303, "/auth/login");
        }
    } else {
        event.locals.user = null;
    }
    if (event.url.pathname.startsWith("/cwl") && !event.locals.user) {
        throw redirect(303, "/auth/login");
    }

    return await resolve(event);
};
