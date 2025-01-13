import { dev } from "$app/environment";
import { API_TOKEN, TURNSTILE_SECRET_KEY } from "$env/static/private";
import { PUBLIC_API_BASE_URI } from "$env/static/public";
import { getPlayerInfo, postVerifyToken } from "$lib/coc/player";
import { validateCFToken } from "$lib/helpers";
import { clanApplicationSchema } from "$lib/schema";
import { createClanApplication, getClanApplicationFromDiscordId, getClanApplicationFromTag, isApplicationEnabled } from "$lib/server/functions";
import { type InsertClanApplication } from "$lib/server/schema";
import { fail, redirect } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    const applicationEnabled = await isApplicationEnabled(locals.db);
    if (!applicationEnabled) return redirect(302, "/");

    const user = locals.user;
    const applications = await getClanApplicationFromDiscordId(locals.db, user?.id as string);
    if (!user) {
        return redirect(302, "/");
    }

    return {
        form: await superValidate(zod(clanApplicationSchema)),
        user: user,
        applications: applications
    };
};

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(clanApplicationSchema));
        if (!form.valid) {
            return fail(400, {
                form
            });
        }

        if (!dev) {
            const cfToken = form.data["cf-turnstile-response"];
            const cfData = await validateCFToken(cfToken, TURNSTILE_SECRET_KEY);

            if (!cfData.success) {
                return message(form, "Invalid captcha response", {
                    status: 400
                });
            }
        }

        const playerTag = form.data.tag;

        const playerToken = form.data.apiToken;
        const playerVerifyData = await postVerifyToken(PUBLIC_API_BASE_URI, playerTag, playerToken, API_TOKEN);
        if ("status" in playerVerifyData && playerVerifyData.status !== "ok") {
            console.error(playerVerifyData);
            return message(form, "Invalid player tag or token", {
                status: 400
            });
        }

        const playerData = await getPlayerInfo(PUBLIC_API_BASE_URI, playerTag, API_TOKEN);

        const [alreadyApplied] = await getClanApplicationFromTag(event.locals.db, playerData.tag);
        if (alreadyApplied) {
            return message(form, "You have already applied to the clan", {
                status: 400
            });
        }

        const application: InsertClanApplication = {
            tag: playerData.tag,
            playerData: playerData,
            discordId: event.locals.user?.id as string
        };

        await createClanApplication(event.locals.db, application);

        return message(form, "Application submitted successfully!");
    }
};
