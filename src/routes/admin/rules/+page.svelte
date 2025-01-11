<script lang="ts">
    import type { PageData } from "./$types";
    import { Carta, MarkdownEditor } from "carta-md";
    import { emoji } from "@cartamd/plugin-emoji";
    import { slash } from "@cartamd/plugin-slash";
    import "./rules_editor.css";

    let { data }: { data: PageData } = $props();
    let rules: string = $state(data.rules);

    const carta = new Carta({
        theme: "catppuccin-mocha",
        sanitizer: false,
        extensions: [emoji(), slash()]
    });
</script>

<div class="marker:text-orange-400 prose-a:text-indigo-400 prose-blockquote:not-italic prose-blockquote:text-green-400">
    <MarkdownEditor {carta} bind:value={rules} mode="tabs" />
</div>
