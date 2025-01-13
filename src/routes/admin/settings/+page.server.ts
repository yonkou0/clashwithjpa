import { getAdminConfig } from "$lib/server/functions";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
    const adminConfig = await getAdminConfig(locals.db);

    return { adminConfig };
}) satisfies PageServerLoad;
