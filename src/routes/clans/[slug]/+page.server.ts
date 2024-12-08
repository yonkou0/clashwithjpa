import { error } from '@sveltejs/kit';
import type { ClanType } from '$lib/types.js';
import { PUBLIC_API_BASE_URI } from '$env/static/public';
import { API_TOKEN } from '$env/static/private';
import { clanTags, getClanInfo } from '$lib/helpers';

export async function load({ params, setHeaders }) {
	try {
		const clanTag = '#' + params.slug;
		if (!Object.keys(clanTags).includes(clanTag)) {
			error(404, `Could not find ${params.slug}`);
		}

		let clanInfo;
		try {
			clanInfo = await getClanInfo(PUBLIC_API_BASE_URI, clanTag, API_TOKEN);
		} catch (e) {
			clanInfo = null;
		}

		setHeaders({
			'cache-control': 'max-age=600'
		});

		return {
			slug: clanTag,
			data: clanInfo as ClanType
		};
	} catch (e) {
		console.log('error', e);
		error(404, `Could not find ${params.slug}`);
	}
}
