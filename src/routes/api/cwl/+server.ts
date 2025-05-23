import type { UserData } from "$lib/auth/user";
import { cwlTable, type InsertCWL } from "$lib/server/schema";
import { json } from "@sveltejs/kit";
import { eq, inArray } from "drizzle-orm";
import type { RequestHandler } from "./$types";

const isAdmin = (user: UserData | null) => user && user.isAdmin;

export const POST: RequestHandler = async ({ locals, request }) => {
    const user = locals.user;
    const body = await request.json();

    if (!isAdmin(user)) {
        return json({ error: "Unauthorized" }, { status: 401 });
    }

    const { key, value } = body;

    if (key === "delete_application") {
        const playerTags = value as string[];
        await locals.db.delete(cwlTable).where(inArray(cwlTable.accountTag, playerTags));
    } else if (key === "update_application") {
        const cwlData: InsertCWL = value;
        cwlData.appliedAt = new Date(cwlData.appliedAt ?? "");
        await locals.db.update(cwlTable).set(cwlData).where(eq(cwlTable.accountTag, cwlData.accountTag));
    }
    return json({ success: true });
};
