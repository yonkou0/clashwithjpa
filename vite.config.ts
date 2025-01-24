import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import Icons from "unplugin-icons/vite";
import { defineConfig } from "vite";

export default defineConfig({
    server: {
        fs: {
            allow: ["./data"]
        }
    },
    plugins: [sveltekit(), tailwindcss(), Icons({ compiler: "svelte" })]
});
