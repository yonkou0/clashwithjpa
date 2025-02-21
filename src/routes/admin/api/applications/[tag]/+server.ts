import type { UserData } from "$lib/auth/user";
import { acceptApplication, rejectApplication } from "$lib/server/functions";
import { cwlTable } from "$lib/server/schema";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import type { RequestHandler } from "./$types";

const isAdmin = (user: UserData | null) => user && user.isAdmin;

export const POST: RequestHandler = async ({ locals, request, params, url }) => {
    const user = locals.user;
    const body = await request.json();
    const tag = decodeURIComponent(params.tag);
    const cwl = url.searchParams.get("cwl");

    if (!isAdmin(user)) {
        return json({ error: "Unauthorized" }, { status: 401 });
    }

    if (cwl?.toLocaleLowerCase() !== "true") {
        if (body.status === "accepted") {
            await acceptApplication(locals.db, tag, body.discordId);
        } else if (body.status === "rejected") {
            await rejectApplication(locals.db, tag);
        }
    } else {
        await locals.db.delete(cwlTable).where(eq(cwlTable.accountTag, tag));
    }

    return json({ success: true });
};
