import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ cookies }) => {
    cookies.set("access_token", "", {
        path: "/",
        expires: new Date(0)
    });

    cookies.set("refresh_token", "", {
        path: "/",
        expires: new Date(0)
    });

    return redirect(302, "/");
};
