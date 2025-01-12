<script lang="ts">
    import type { PageData } from "./$types";
    import { Tipex } from "@friendofsvelte/tipex";
    import "@friendofsvelte/tipex/styles/Tipex.css";
    import "@friendofsvelte/tipex/styles/ProseMirror.css";
    import "@friendofsvelte/tipex/styles/Controls.css";
    import "@friendofsvelte/tipex/styles/EditLink.css";
    import "@friendofsvelte/tipex/styles/CodeBlock.css";
    import "./tipex.css";

    let { data }: { data: PageData } = $props();
    let rules = $state(data.compile.code);
</script>

<div class="dark flex size-full marker:text-orange-400 prose-a:text-indigo-400 prose-blockquote:not-italic prose-blockquote:text-green-400">
    <Tipex body={rules} controls floating focal={false} />
</div>
