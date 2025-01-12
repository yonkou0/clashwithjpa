<script lang="ts">
    import { Tipex, type TipexEditor } from "@friendofsvelte/tipex";
    import "@friendofsvelte/tipex/styles/CodeBlock.css";
    import "@friendofsvelte/tipex/styles/Controls.css";
    import "@friendofsvelte/tipex/styles/EditLink.css";
    import "@friendofsvelte/tipex/styles/ProseMirror.css";
    import "@friendofsvelte/tipex/styles/Tipex.css";
    import MaterialSymbolsSendRounded from "~icons/material-symbols/send-rounded";
    import type { PageData } from "./$types";
    import "./tipex.css";

    let { data }: { data: PageData } = $props();
    let rules = $state(data.compile.code);

    let editor: TipexEditor | undefined = $state();
    let htmlContent = $derived(editor?.getHTML());
</script>

<div class="dark flex size-full marker:text-orange-400 prose-a:text-indigo-400 prose-blockquote:not-italic prose-blockquote:text-green-400">
    <Tipex bind:tipex={editor} body={rules} controls floating focal={false}>
        {#snippet utilities()}
            <button class="tipex-edit-button">
                <MaterialSymbolsSendRounded class="size-6" />
            </button>
        {/snippet}
    </Tipex>
</div>
