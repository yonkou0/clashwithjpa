import type { LayoutServerLoad } from "./$types";
import { getUserData } from "$lib/auth/user";

export const load = (async ({ cookies }) => {
    const accessToken = cookies.get("access_token");

    if (!accessToken) {
        return {};
    }

    const userData = await getUserData(accessToken);
    return { userData };

}) satisfies LayoutServerLoad;
