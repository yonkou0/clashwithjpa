import { getAllCWLApplications, getClansPublicData } from "$lib/server/functions";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    const cwlApplications = await getAllCWLApplications(locals.db);
    const clans = await getClansPublicData(locals.db);

    return { cwlApplications, clans };
};
