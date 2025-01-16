import { getClansPublicData } from "$lib/server/functions";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
    const clans = await getClansPublicData(locals.db);

    return { clans };
}) satisfies PageServerLoad;
