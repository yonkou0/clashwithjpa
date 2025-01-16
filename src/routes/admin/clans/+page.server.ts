import type { PageServerLoad } from "./$types";
import { getClansPublicData } from "$lib/server/functions";

export const load = (async ({ setHeaders, locals }) => {
    const clans = await getClansPublicData(locals.db);

    return { clans };
}) satisfies PageServerLoad;
