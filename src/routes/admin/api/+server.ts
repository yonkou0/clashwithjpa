import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { settingsTable } from "$lib/server/schema";
import { eq } from "drizzle-orm";
import { PUBLIC_DISCORD_URL } from "$env/static/public";
import { DISCORD_BOT_TOKEN } from "$env/static/private";

export const POST: RequestHandler = async ({ locals, request }) => {
    const user = locals.user;
    const body = await request.json();
    if (!user || !user.isAdmin) {
        return json({ error: "Unauthorized" }, { status: 401 });
    }

    const { key, value } = body;
    if (key === "guild_id") {
        const resp = await fetch(`${PUBLIC_DISCORD_URL}/guilds/${value.id}`, {
            headers: {
                Authorization: `Bot ${DISCORD_BOT_TOKEN}`
            }
        });
        if (!resp.ok) {
            return json({ error: "Invalid guild ID" }, { status: 400 });
        }
    }
    await locals.db.update(settingsTable).set({ value: value }).where(eq(settingsTable.key, key));

    return json({ success: true });
};
