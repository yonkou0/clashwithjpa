<script lang="ts">
    import { page } from "$app/state";
    import Button from "$lib/components/Button.svelte";
    import MaterialSymbolsChevronLeftRounded from "~icons/material-symbols/chevron-left-rounded";
</script>

<svelte:head>
    <title>JPA | {page.error?.message}</title>
</svelte:head>

<div class="size-full bg-cover">
    <img src="/bg_error.webp" alt="Error" class="fixed left-0 top-0 -z-10 size-full object-cover" />

    <div class="flex size-full items-center justify-center overflow-hidden bg-gray-950/50">
        <div class="flex size-full flex-col items-center justify-center space-y-1 p-5">
            <h1 class="text-3xl font-bold md:text-5xl lg:text-4xl">{page.status}</h1>
            <h2 class="text-lg font-semibold text-gray-400 lg:text-xl">{page.error?.message}</h2>
            <div class="pt-5">
                <Button href="/" size="md" class="group">
                    <MaterialSymbolsChevronLeftRounded class="size-8 transition-transform group-hover:-translate-x-2 " />
                    <span>Homepage</span>
                </Button>
            </div>
        </div>
    </div>
</div>
