import { clanFormSchema } from "$lib/coc/schema";
import { getClansPublicData } from "$lib/server/functions";
import type { Actions } from "@sveltejs/kit";
import { fail, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
    const clans = await getClansPublicData(locals.db);

    return { form: await superValidate(zod(clanFormSchema)), clans };
}) satisfies PageServerLoad;

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(clanFormSchema));
        if (!form.valid) {
            return fail(400, { form });
        }

        return {
            status: 200,
            body: {
                form
            }
        };
    }
};
