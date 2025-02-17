import { redirect } from "@sveltejs/kit";
import { getUserAccounts } from "$lib/server/functions";
import { API_TOKEN, TURNSTILE_SECRET_KEY } from "$env/static/private";
import { PUBLIC_API_BASE_URI } from "$env/static/public";
import { dev } from "$app/environment";
import { validateCFToken } from "$lib/cf/helpers";
import { cwlApplicationSchema } from "$lib/schema";
import { getPlayerInfo } from "$lib/coc/player";
import { fail, message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { Actions, PageServerLoad } from "./$types";
import { type InsertCWL, type SelectCWL } from "$lib/server/schema";

export const load = (async ({ locals }) => {
    const user = locals.user;
    if (!user) {
        return redirect(302, "/");
    }

    const userAccount = await getUserAccounts(locals.db, user.id);
    if (!userAccount) {
        return redirect(302, "/");
    }

    if (!userAccount.isActive) {
        console.log("User account not found");
        return redirect(302, "/");
    }

    return {
        form: await superValidate(zod(cwlApplicationSchema)),
        user: user,
        userAccount: userAccount
    };
}) satisfies PageServerLoad;

interface FWAStatsMember {
    tag: string;
    name: string;
    role: string;
    level: number;
    donated: number;
    received: number;
    rank: number;
    trophies: number;
    league: string;
    townHall: number;
    weight: number;
    inWar: boolean;
}

interface FWAStats {
    [key: string]: FWAStatsMember;
}

async function getFWAStats(clanTag: string) {
    console.log(clanTag);
    clanTag = clanTag.replace("#", "");
    const resp = await fetch(`https://fwastats.com/Clan/${clanTag}/Members.json`);

    if (!resp.ok) {
        return { error: true };
    }

    const data = await resp.json();
    const members: { [key: string]: FWAStatsMember } = {};
    data.forEach((member: FWAStatsMember) => {
        members[member.tag] = member;
    });

    return members as FWAStats;
}

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(cwlApplicationSchema));
        if (!form.valid) {
            return fail(400, {
                form
            });
        }

        if (!dev) {
            // const applicationEnabled = await isApplicationEnabled(event.locals.db);      // add for cwlApplications too
            // if (!applicationEnabled) {
            //     return message(form, "Applications are disabled", {
            //         status: 400
            //     });
            // }

            const cfToken = form.data["cf-turnstile-response"];
            const cfData = await validateCFToken(cfToken, TURNSTILE_SECRET_KEY);

            if (!cfData.success) {
                return message(form, "Invalid captcha response", {
                    status: 400
                });
            }
        }

        const playerTag = form.data.tag;
        const playerData = await getPlayerInfo(PUBLIC_API_BASE_URI, API_TOKEN, playerTag);
        const playerClanTag = playerData.clan?.tag;
        const playerClanName = playerData.clan?.name;
        const fwaStats = await getFWAStats(playerClanTag as string);
        const fwaStatsMember = "error" in fwaStats ? undefined : fwaStats[playerTag.replace("#", "")];

        if (!fwaStatsMember) {
            return message(form, "You are not in the FWA clan", {
                status: 400
            });
        }

        const playerAccountWeight = fwaStatsMember.weight;

        const [month, year] = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }).split(" ");

        const cwlApplication: InsertCWL = {
            userId: event.locals.user?.id as string,
            userName: event.locals.user?.username as string,
            accountName: playerData.name,
            accountTag: playerData.tag,
            accountClan: playerClanName as string,
            accountWeight: playerAccountWeight,
            month: month,
            year: year as unknown as number,
            preferenceNum: form.data.preferenceNum
        };

        console.log(cwlApplication);

        return message(form, "Application submitted successfully!");
    }
};
