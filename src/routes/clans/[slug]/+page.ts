import type { PageLoad } from './$types';

export const load = (async ({ params, data }) => {
	const post = await import(`../../../clans/${params.slug}.md`);

	return {
		...data,
		content: post.default,
		meta: post.metadata
	};
}) satisfies PageLoad;
