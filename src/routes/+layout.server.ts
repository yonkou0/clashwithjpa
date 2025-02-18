import type { UserData } from "$lib/auth/user";
import { isApplicationEnabled, isCWLEnabled } from "$lib/server/functions";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals }) => {
    const user = locals.user as UserData;
    const applicationEnabled = await isApplicationEnabled(locals.db);
    const cwlEnabled = await isCWLEnabled(locals.db);

    return {
        user,
        applicationEnabled,
        cwlEnabled
    };
}) satisfies LayoutServerLoad;
