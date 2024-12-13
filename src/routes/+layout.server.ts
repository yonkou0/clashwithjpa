import type { UserData } from "$lib/auth/sessionHelper";

export const load = async ({ locals, setHeaders }) => {
    setHeaders({
        "cache-control": "max-age=600" // 10 minutes
    })

    return { user: locals.user as UserData | null };
};
