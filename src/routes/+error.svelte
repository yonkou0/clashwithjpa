<script lang="ts">
    import { page } from "$app/stores";
    import Button from "$lib/components/Button.svelte";
    import MaterialSymbolsChevronLeftRounded from "~icons/material-symbols/chevron-left-rounded";
</script>

<svelte:head>
    <title>JPA | {$page.error?.message}</title>
</svelte:head>

<div class="size-full">
    <div class="flex size-full items-center justify-start overflow-hidden">
        <img src="/404_robot.webp" alt="404 Error" class="w-[100vh] hidden lg:block" />
        <div class="flex size-full flex-col items-center justify-center space-y-1 p-5">
            <h1 class="text-3xl font-bold md:text-5xl lg:text-4xl">{$page.status}</h1>
            <h2 class="text-lg font-semibold text-gray-400 lg:text-xl">{$page.error?.message}</h2>
            <div class="pt-5">
                <Button href="/" size="md" class="group">
                    <MaterialSymbolsChevronLeftRounded class="size-8 transition-transform group-hover:-translate-x-2 " />
                    <span>Homepage</span>
                </Button>
            </div>
        </div>
    </div>
</div>
