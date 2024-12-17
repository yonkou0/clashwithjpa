import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
    const resp = await event.fetch(`/auth/user`);
    if (resp.ok) {
        const data = await resp.json();
        if (!data.error) {
            return { user: data };
        } else {
            return { user: null };
        }
    } else {
        return { user: null };
    }
};
