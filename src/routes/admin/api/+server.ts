import { DISCORD_BOT_TOKEN } from "$env/static/private";
import { PUBLIC_DISCORD_URL } from "$env/static/public";
import { settingsTable } from "$lib/server/schema";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ locals, request }) => {
    const user = locals.user;
    const body = await request.json();

    // Check if user is an admin
    if (!user || !user.isAdmin) {
        return json({ error: "Unauthorized" }, { status: 401 });
    }

    const { key, value } = body;

    // Check if guild_id is valid (if key is "guild_id")
    let guildData = null;
    if (key === "guild_id") {
        guildData = await checkGuild(value);
        if (guildData.error) {
            return json({ error: "Invalid Guild ID" }, { status: 400 });
        }
    }

    // Update settings table
    await locals.db.update(settingsTable).set({ value: value }).where(eq(settingsTable.key, key));

    // Return guild data if key is "guild_id"
    if (key === "guild_id" && guildData) {
        return json(guildData);
    }
    return json({ success: true });
};

// Guild check func
async function checkGuild(value: any) {
    const resp = await fetch(`${PUBLIC_DISCORD_URL}/guilds/${value.id}`, {
        headers: {
            Authorization: `Bot ${DISCORD_BOT_TOKEN}`
        }
    });
    if (!resp.ok) {
        return { error: true };
    }
    return await resp.json();
}
