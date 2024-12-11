import { logout } from "$lib/auth/sessionHelper";
import { json, type Handle } from "@sveltejs/kit";

export const POST: Handle = async ({ event }) => {
    logout(event.cookies);
    return json({ success: true });
};
