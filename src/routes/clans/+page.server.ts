import type { PageServerLoad } from './$types';
import type { ClanType } from '$lib/types';
import { PUBLIC_API_BASE_URI } from '$env/static/public';
import { API_TOKEN } from '$env/static/private';
import { clanTags, getClansInfo } from '$lib/helpers';

export const load = (async ({ setHeaders }) => {
	async function getClans() {
		const clanTagsArray = Object.keys(clanTags);
		const clansInfo = await getClansInfo(PUBLIC_API_BASE_URI, clanTagsArray, API_TOKEN);
		return clansInfo;
	}

	setHeaders({
		'cache-control': 'max-age=600'
	});

	return {
		data: getClans() as Promise<ClanType[]>
	};
}) satisfies PageServerLoad;
