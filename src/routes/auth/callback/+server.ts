import type { RequestHandler } from "./$types";
import { error, redirect } from "@sveltejs/kit";
import { getSessionCookies } from "$lib/auth/sessionHelper";

export const GET: RequestHandler = async ({ url }) => {
    const code = url.searchParams.get("code");
    if (!code) {
        return error(400, "No code provided");
    }

    try {
        const { accessCookie, refreshCookie } = await getSessionCookies(code, url);
        return new Response("", {
            status: 307,
            headers: {
                "Set-Cookie": [accessCookie, refreshCookie].join(", "),
                Location: "/"
            }
        });
    } catch {
        return redirect(302, "/login");
    }
};
