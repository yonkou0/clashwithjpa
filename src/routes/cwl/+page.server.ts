import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { getUserAccounts } from "$lib/server/functions";

export const load = (async ({ locals }) => {
    const user = locals.user;
    if (!user) {
        return redirect(302, "/");
    }

    const userAccount = await getUserAccounts(locals.db, user.id);


    return {
        user: user,
        userAccount: userAccount,
    };
}) satisfies PageServerLoad;
