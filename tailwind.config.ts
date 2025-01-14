import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

export default {
    content: ["./src/**/*.{html,js,svelte,ts}"],

    theme: {
        extend: {
            screens: {
                "3xl": "2560px"
            },
            fontFamily: {
                coc: "COC"
            }
        }
    },

    plugins: [typography, forms]
} satisfies Config;
