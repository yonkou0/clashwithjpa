import { logout } from "$lib/auth/sessionHelper";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, locals }) => {
    logout(cookies);
    locals.user = null;
    return json({ success: true });
};
