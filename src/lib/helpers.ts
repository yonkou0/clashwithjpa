import type { ClanType, ClanMemberType, ClanTagsType, LabelType } from './types';

export const clanTags: ClanTagsType = {
	'#9JUVCV0L': {
		attacks: 70,
		donations: 5000,
		clanGames: 1000
	},
	'#PQP2Y2QV': {
		attacks: 60,
		donations: 5000,
		clanGames: 1000
	},
	'#PCCJUVJQ': {
		attacks: 60,
		donations: 5000,
		clanGames: 1000
	},
	'#GGUR2Y2': {
		attacks: 60,
		donations: 5000,
		clanGames: 1000
	},
	'#RCPLRRJ8': {
		attacks: 70,
		donations: 6000,
		clanGames: 1000
	},
	'#P9RLJR2J': {
		attacks: 50,
		donations: 3500,
		clanGames: 1000
	},
	'#29VJYRLY8': {
		attacks: 20,
		donations: 1000,
		clanGames: 1000
	},
	'#GL0RRUC0': {
		attacks: 50,
		donations: 3500,
		clanGames: 1000
	}
};

export async function getClanInfo(
	baseURI: string,
	clanTag: string,
	apiToken: string
): Promise<ClanType> {
	console.log('fetching clan info for', clanTag);
	clanTag = clanTag.replace('#', '%23');
	const response = await fetch(`${baseURI}/v1/clans/${clanTag}`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${apiToken}`
		}
	});

	if (!response.ok) {
		console.log('error fetching clan info', await response.text());
		throw new Error(`Error fetching clan info: ${response.statusText}`);
	}
	return await response.json();
}

export async function getClansInfo(
	baseURI: string,
	clanTags: string[],
	apiToken: string
): Promise<ClanType[]> {
	const promises = clanTags.map((tag) => getClanInfo(baseURI, tag, apiToken));
	return await Promise.all(promises);
}

export const labels: LabelType = {
	clanwars: {
		small:
			'https://api-assets.clashofclans.com/labels/64/lXaIuoTlfoNOY5fKcQGeT57apz1KFWkN9-raxqIlMbE.png',
		medium:
			'https://api-assets.clashofclans.com/labels/128/lXaIuoTlfoNOY5fKcQGeT57apz1KFWkN9-raxqIlMbE.png'
	},
	clanwarleague: {
		small:
			'https://api-assets.clashofclans.com/labels/64/5w60_3bdtYUe9SM6rkxBRyV_8VvWw_jTlDS5ieU3IsI.png',
		medium:
			'https://api-assets.clashofclans.com/labels/128/5w60_3bdtYUe9SM6rkxBRyV_8VvWw_jTlDS5ieU3IsI.png'
	},
	trophypushing: {
		small:
			'https://api-assets.clashofclans.com/labels/64/hNtigjuwJjs6PWhVtVt5HvJgAp4ZOMO8e2nyjHX29sA.png',
		medium:
			'https://api-assets.clashofclans.com/labels/128/hNtigjuwJjs6PWhVtVt5HvJgAp4ZOMO8e2nyjHX29sA.png'
	},
	friendlywars: {
		small:
			'https://api-assets.clashofclans.com/labels/64/6NxZMDn9ryFw8-FHJJimcEkKwnXZHMVUp_0cCVT6onY.png',
		medium:
			'https://api-assets.clashofclans.com/labels/128/6NxZMDn9ryFw8-FHJJimcEkKwnXZHMVUp_0cCVT6onY.png'
	},
	clangames: {
		small:
			'https://api-assets.clashofclans.com/labels/64/7qU7tQGERiVITVG0CPFov1-BnFldu4bMN2gXML5bLIU.png',
		medium:
			'https://api-assets.clashofclans.com/labels/128/7qU7tQGERiVITVG0CPFov1-BnFldu4bMN2gXML5bLIU.png'
	},
	builderbase: {
		small:
			'https://api-assets.clashofclans.com/labels/64/kyuaiAWdnD9v3ReYPS3_x6QP3V3e0nNAPyDroOIDFZQ.png',
		medium:
			'https://api-assets.clashofclans.com/labels/128/kyuaiAWdnD9v3ReYPS3_x6QP3V3e0nNAPyDroOIDFZQ.png'
	},
	basedesigning: {
		small:
			'https://api-assets.clashofclans.com/labels/64/LG966XuC6YoEJsPthcgtyJ8uS46LqYDAeiHJNQKR3YQ.png',
		medium:
			'https://api-assets.clashofclans.com/labels/128/LG966XuC6YoEJsPthcgtyJ8uS46LqYDAeiHJNQKR3YQ.png'
	},
	international: {
		small:
			'https://api-assets.clashofclans.com/labels/64/zyaTKuJXrsPiU3DvjgdqaSA6B1qvcQ0cjD6ktRah4xs.png',
		medium:
			'https://api-assets.clashofclans.com/labels/128/zyaTKuJXrsPiU3DvjgdqaSA6B1qvcQ0cjD6ktRah4xs.png'
	},
	farming: {
		small:
			'https://api-assets.clashofclans.com/labels/64/iLWz6AiaIHg_DqfG6s9vAxUJKb-RsPbSYl_S0ii9GAM.png',
		medium:
			'https://api-assets.clashofclans.com/labels/128/iLWz6AiaIHg_DqfG6s9vAxUJKb-RsPbSYl_S0ii9GAM.png'
	},
	donations: {
		small:
			'https://api-assets.clashofclans.com/labels/64/RauzS-02tv4vWm1edZ-q3gPQGWKGANLZ-85HCw_NVP0.png',
		medium:
			'https://api-assets.clashofclans.com/labels/128/RauzS-02tv4vWm1edZ-q3gPQGWKGANLZ-85HCw_NVP0.png'
	},
	friendly: {
		small:
			'https://api-assets.clashofclans.com/labels/64/hM7SHnN0x7syFa-s6fE7LzeO5yWG2sfFpZUHuzgMwQg.png',
		medium:
			'https://api-assets.clashofclans.com/labels/128/hM7SHnN0x7syFa-s6fE7LzeO5yWG2sfFpZUHuzgMwQg.png'
	},
	talkative: {
		small:
			'https://api-assets.clashofclans.com/labels/64/T1c8AYalTn_RruVkY0mRPwNYF5n802thTBEEnOtNTMw.png',
		medium:
			'https://api-assets.clashofclans.com/labels/128/T1c8AYalTn_RruVkY0mRPwNYF5n802thTBEEnOtNTMw.png'
	},
	underdog: {
		small:
			'https://api-assets.clashofclans.com/labels/64/ImSgCg88EEl80mwzFZMIiJTqa33bJmJPcl4v2eT6O04.png',
		medium:
			'https://api-assets.clashofclans.com/labels/128/ImSgCg88EEl80mwzFZMIiJTqa33bJmJPcl4v2eT6O04.png'
	},
	relaxed: {
		small:
			'https://api-assets.clashofclans.com/labels/64/Kv1MZQfd5A7DLwf1Zw3tOaUiwQHGMwmRpjZqOalu_hI.png',
		medium:
			'https://api-assets.clashofclans.com/labels/128/Kv1MZQfd5A7DLwf1Zw3tOaUiwQHGMwmRpjZqOalu_hI.png'
	},
	competitive: {
		small:
			'https://api-assets.clashofclans.com/labels/64/DhBE-1SSnrZQtsfjVHyNW-BTBWMc8Zoo34MNRCNiRsA.png',
		medium:
			'https://api-assets.clashofclans.com/labels/128/DhBE-1SSnrZQtsfjVHyNW-BTBWMc8Zoo34MNRCNiRsA.png'
	},
	newbiefriendly: {
		small:
			'https://api-assets.clashofclans.com/labels/64/3oOuYkPdkjWVrBUITgByz9Ur0nmJ4GsERXc-1NUrjKg.png',
		medium:
			'https://api-assets.clashofclans.com/labels/128/3oOuYkPdkjWVrBUITgByz9Ur0nmJ4GsERXc-1NUrjKg.png'
	},
	clancapital: {
		small:
			'https://api-assets.clashofclans.com/labels/64/Odg2DaLfhMgQOci4QvHovdoYq4SDiBrocWS2Bjm8Ah8.png',
		medium:
			'https://api-assets.clashofclans.com/labels/128/Odg2DaLfhMgQOci4QvHovdoYq4SDiBrocWS2Bjm8Ah8.png'
	}
};

type DateStyle = Intl.DateTimeFormatOptions['dateStyle'];

export function formatDate(date: string, dateStyle: DateStyle = 'medium', locales = 'en') {
	// Safari is mad about dashes in the date
	const dateToFormat = new Date(date.replaceAll('-', '/'));
	const dateFormatter = new Intl.DateTimeFormat(locales, { dateStyle });
	return dateFormatter.format(dateToFormat);
}

export function categorizeByRole(array: ClanMemberType[]) {
	return array.reduce((acc: { [key: string]: ClanMemberType[] }, curr) => {
		const role = curr.role;
		if (['leader', 'coLeader', 'member'].includes(role)) {
			if (!acc[role]) {
				acc[role] = [];
			}
			acc[role].push(curr);
		}
		return acc;
	}, {});
}
