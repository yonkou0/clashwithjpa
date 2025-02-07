import { API_TOKEN } from "$env/static/private";
import { PUBLIC_API_BASE_URI } from "$env/static/public";
import type { UserData } from "$lib/auth/user";
import { getPlayerInfo } from "$lib/coc/player";
import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

const isAdmin = (user: UserData | null) => user && user.isAdmin;

export const GET: RequestHandler = async ({ locals, url, setHeaders }) => {
    setHeaders({
        "cache-control": "max-age=6000" // 100 minutes
    });

    const user = locals.user;
    const tag = url.searchParams.get("tag");

    if (!isAdmin(user)) {
        return json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!tag) {
        return json({ error: "Missing Player Tag" }, { status: 400 });
    }

    const playerInfo = await getPlayerInfo(PUBLIC_API_BASE_URI, API_TOKEN, tag);
    console.log("-->", playerInfo);

    return json(playerInfo);
};
