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
    import { toast } from "$lib/components/toast";
    import { invalidateAll } from "$app/navigation";

    let { data }: { data: PageData } = $props();
    let rules = $state(data.rules.content);

    let editor: TipexEditor | undefined = $state();
    let htmlContent = $derived(editor?.getHTML());

    async function save() {
        const body = {
            key: "rules",
            value: {
                content: htmlContent
            }
        };
        let response = await fetch("/api/admin/rules", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            toast.success("Rules saved successfully");
            invalidateAll();
        } else {
            toast.error("Failed to save rules");
        }
    }
</script>

<div class="dark flex size-full marker:text-orange-400 prose-a:text-indigo-400 prose-blockquote:not-italic prose-blockquote:text-green-400">
    <Tipex bind:tipex={editor} body={rules} controls floating focal={false}>
        {#snippet utilities()}
            <button class="tipex-edit-button" onclick={save}>
                <MaterialSymbolsSendRounded class="size-6" />
            </button>
        {/snippet}
    </Tipex>
</div>
