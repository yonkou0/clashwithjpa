import type { UserData } from "$lib/auth/user";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { acceptApplication, rejectApplication } from "$lib/server/functions";

const isAdmin = (user: UserData | null) => user && user.isAdmin;

export const POST: RequestHandler = async ({ locals, request, params }) => {
    const user = locals.user;
    const body = await request.json();
    const tag = decodeURIComponent(params.tag);

    if (!isAdmin(user)) {
        return json({ error: "Unauthorized" }, { status: 401 });
    }

    if (body.status === "accepted") {
        await acceptApplication(locals.db, tag);
    } else if (body.status === "rejected") {
        await rejectApplication(locals.db, tag);
    }

    return json({ success: true });
};
