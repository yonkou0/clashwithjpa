import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";

export const POST: RequestHandler = ({ locals, request }) => {
    const user = locals.user;
    if (!user || !user.isAdmin) {
        return json({ error: "Unauthorized" }, { status: 401 });
    }

    return new Response();
};
