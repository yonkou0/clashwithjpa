<script lang="ts">
    import type { PageData } from "./$types";
    import { Tipex } from "@friendofsvelte/tipex";
    import "@friendofsvelte/tipex/styles/Tipex.css";
    import "@friendofsvelte/tipex/styles/ProseMirror.css";
    import "@friendofsvelte/tipex/styles/Controls.css";
    import "@friendofsvelte/tipex/styles/EditLink.css";
    import "@friendofsvelte/tipex/styles/CodeBlock.css";

    let { data }: { data: PageData } = $props();
    let rules = $state(data.compile.code);
</script>

<!-- <div class="flex h-full w-full flex-col marker:text-orange-400 prose-a:text-indigo-400 prose-blockquote:not-italic prose-blockquote:text-green-400">
    <article class="prose- prose w-full max-w-none bg-zinc-400"></article>
</div> -->

<div class="dark">
    <Tipex body={rules} controls floating focal class="h-[70vh]" />
</div>
