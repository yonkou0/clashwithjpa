<script lang="ts">
    import { page } from "$app/state";
    import CocButton from "$lib/components/CocButton.svelte";
    import MaterialSymbolsChevronLeftRounded from "~icons/material-symbols/chevron-left-rounded";
</script>

<svelte:head>
    <title>JPA | {page.error?.message}</title>
</svelte:head>

<div class="size-full bg-cover">
    <img src="/bg_error.webp" alt="Error" class="fixed top-0 left-0 -z-10 size-full object-cover" />

    <div class="flex size-full items-center justify-center overflow-hidden bg-gray-950/50">
        <div class="flex size-full flex-col items-center justify-center space-y-1 p-5">
            <h1 class="text-4xl font-bold md:text-6xl lg:text-5xl">{page.status}</h1>
            <h2 class="text-xl font-semibold text-gray-400 lg:text-2xl">{page.error?.message}</h2>
            <div class="pt-5">
                <CocButton href="/" size="md" class="group">
                    <MaterialSymbolsChevronLeftRounded class="size-8 transition-transform group-hover:-translate-x-2" />
                    <span>Homepage</span>
                </CocButton>
            </div>
        </div>
    </div>
</div>
