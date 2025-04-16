import { getAllCWLApplications } from "$lib/server/functions";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    const cwlApplications = await getAllCWLApplications(locals.db);

    return { cwlApplications };
};
