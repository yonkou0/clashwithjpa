import type { UserData } from "$lib/auth/user";
import { isApplicationEnabled } from "$lib/server/functions";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals }) => {
    const user = locals.user as UserData;
    const applicationEnabled = await isApplicationEnabled(locals.db);

    return {
        user,
        applicationEnabled
    };
}) satisfies LayoutServerLoad;
