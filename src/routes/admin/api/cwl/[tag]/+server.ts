import type { UserData } from "$lib/auth/user";
import { cwlTable } from "$lib/server/schema";
import { json } from "@sveltejs/kit";
import { inArray } from "drizzle-orm";
import type { RequestHandler } from "./$types";

const isAdmin = (user: UserData | null) => user && user.isAdmin;

export const POST: RequestHandler = async ({ locals, params }) => {
    const user = locals.user;
    const tags = decodeURIComponent(params.tag);
    const playerTags = tags.split(",");

    if (!isAdmin(user)) {
        return json({ error: "Unauthorized" }, { status: 401 });
    }

    await locals.db.delete(cwlTable).where(inArray(cwlTable.accountTag, playerTags));

    return json({ success: true });
};
