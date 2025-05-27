import { DISCORD_BOT_TOKEN } from "$env/static/private";
import { PUBLIC_DISCORD_URL } from "$env/static/public";
import type { UserData } from "$lib/auth/user";
import { checkChannel } from "$lib/discord/check";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

const isAdmin = (user: UserData | null) => user && user.isAdmin;

export const GET: RequestHandler = async ({ locals, url, setHeaders }) => {
    setHeaders({
        "cache-control": "max-age=6000" // 100 minutes
    });

    const user = locals.user;
    const channelID = url.searchParams.get("id");

    if (!isAdmin(user)) {
        return json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!channelID) {
        return json({ error: "Channel ID not provided" }, { status: 400 });
    }

    const chanelData = await checkChannel(PUBLIC_DISCORD_URL, DISCORD_BOT_TOKEN, channelID);
    if ("error" in chanelData) {
        return json({ error: true }, { status: 500 });
    }
    return json(chanelData);
};
