import { mdsvex } from "mdsvex";
import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGemoji from "remark-gemoji";
import remarkUnwrapImages from "remark-unwrap-images";

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
    extensions: [".md"],
    remarkPlugins: [remarkUnwrapImages, remarkGemoji],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],

    kit: {
        adapter: adapter({
            routes: {
                include: ["/*"],
                exclude: ["<all>"]
            }
        })
    },

    extensions: [".svelte", ".md"]
};

export default config;
