import type { PageLoad } from "./$types";

export const load = (async ({ params, data }) => {
    const post = await import(`../../../../data/clans/${params.tag}.md`);

    return {
        ...data,
        content: post.default,
        meta: post.metadata
    };
}) satisfies PageLoad;
