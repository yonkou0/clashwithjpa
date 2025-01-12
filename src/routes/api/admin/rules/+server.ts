import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { settingsTable } from "$lib/server/schema";
import { eq } from "drizzle-orm";

export const POST: RequestHandler = async ({ locals, request }) => {
    const user = locals.user;
    const body = await request.json();
    if (!user || !user.isAdmin) {
        return json({ error: "Unauthorized" }, { status: 401 });
    }

    const { key, value } = body;
    await locals.db.update(settingsTable).set({ value: value }).where(eq(settingsTable.key, key));

    return json({ success: true });
};
