import type { UserData } from "$lib/auth/user";
import { getAdminRolesAndMembers } from "$lib/server/functions";
import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals }) => {
    const user = locals.user as UserData;
    const admin = await getAdminRolesAndMembers(locals.db);

    console.log(admin);

    return {
        user
    };
}) satisfies LayoutServerLoad;
