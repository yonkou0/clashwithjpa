import { getRules } from "$lib/server/functions";
import { compile } from "mdsvex/dist/browser-es.js";
import type { MdsvexOptions } from "mdsvex";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGemoji from "remark-gemoji";
import remarkUnwrapImages from "remark-unwrap-images";
import type { PageServerLoad } from "./$types";

const mdsvexOptions: MdsvexOptions = {
    extensions: [".md"],
    // @ts-expect-error - mdsvex types are incorrect
    remarkPlugins: [remarkUnwrapImages, remarkGemoji],
    // @ts-expect-error - mdsvex types are incorrect
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]
};

export const load = (async ({ setHeaders, locals }) => {
    const rules = await getRules(locals.db);

    setHeaders({
        "cache-control": "max-age=6000" // 100 minutes
    });
    return { rules, compiled: await compile(rules, mdsvexOptions) };
}) satisfies PageServerLoad;
