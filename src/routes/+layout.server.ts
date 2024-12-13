import type { UserData } from "$lib/auth/sessionHelper";

export const load = async ({ locals }) => {
    return { user: locals.user as UserData | null };
};
