<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import { onMount, type Component } from "svelte";
    import { fade } from "svelte/transition";
    import MaterialSymbolsArrowUpwardRounded from "~icons/material-symbols/arrow-upward-rounded";
    import order from "../../../../data/rules/order.json";

    const ruleFiles: Record<string, object> = import.meta.glob("../../../../data/rules/*.md", { eager: true });
    const rulesOrder: string[] = JSON.parse(JSON.stringify(order));
    const basePath = "../../../../data/rules/";

    const shortedRuleFiles: Record<string, { default: Component }> = Object.entries(ruleFiles)
        .sort(([a], [b]) => {
            const aIndex = rulesOrder.indexOf(a.replace(basePath, ""));
            const bIndex = rulesOrder.indexOf(b.replace(basePath, ""));
            return aIndex - bIndex;
        })
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    let showScrollButton = $state(false);
    onMount(() => {
        const handleScroll = () => {
            showScrollButton = window.scrollY > 100;
        };
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
    });
</script>

<svelte:head>
    <title>JPA | Rules</title>
</svelte:head>

<div class="mt-32 flex w-full flex-col items-start gap-5 px-5 pb-5 lg:flex-row lg:px-10">
    {#if showScrollButton}
        <div transition:fade={{ duration: 200 }} class="fixed bottom-4 right-4 z-10">
            <Button
                onclick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                class="group size-11"
            >
                <MaterialSymbolsArrowUpwardRounded class="size-5 transition-transform group-hover:-translate-y-1 " />
            </Button>
        </div>
    {/if}

    <div
        class="w-full flex-1 pt-5 marker:text-orange-400 prose-a:text-indigo-400 prose-blockquote:not-italic prose-blockquote:text-green-400 lg:pl-5 lg:pt-0"
    >
        <article class="prose prose-invert w-full max-w-none">
            {#each Object.keys(shortedRuleFiles) as componentFile}
                {@const SvelteComponent = shortedRuleFiles[componentFile].default}
                <SvelteComponent />
            {/each}
        </article>
    </div>
</div>
