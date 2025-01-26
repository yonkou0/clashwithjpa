import { getApplications } from "$lib/server/functions";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    const applications = await getApplications(locals.db);
    return { applications };
};
