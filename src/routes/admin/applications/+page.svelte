<script lang="ts">
    import AdminApplications from "$lib/components/Admin/Applications.svelte";
    import { Switch } from "bits-ui";
    import { fade } from "svelte/transition";
    import type { PageData } from "./$types";
    import CWLApplications from "$lib/components/Admin/CWLApplications.svelte";

    let { data }: { data: PageData } = $props();
    let cwlView: boolean = $state(false);

    const types: ("pending" | "rejected")[] = ["pending", "rejected"];
</script>

<div
    class="fixed right-5 bottom-22 z-20 flex items-center justify-center gap-2 rounded-md border border-gray-700 bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 p-2 opacity-50 transition-opacity hover:opacity-100 md:bottom-5"
>
    <span>CWL</span>
    <Switch.Root
        name="applicationStatus"
        onCheckedChange={() => {
            cwlView = !cwlView;
        }}
        class="inline-flex h-5 w-[40px] items-center gap-11 rounded-full bg-red-800 p-1 transition-all disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-green-600"
    >
        <Switch.Thumb
            class="pointer-events-none block size-5 shrink-0 rounded-full bg-gray-50 transition-all data-[state=checked]:translate-x-[80%] data-[state=unchecked]:-translate-x-1"
        />
    </Switch.Root>
</div>

{#if !cwlView}
    <div class="p-5 *:not-first:mt-11 md:p-11" in:fade>
        {#each types as type}
            <div class="flex w-full flex-col">
                <h1 class="text-3xl font-bold md:text-4xl">{type.replace(/^\w/, (c) => c.toUpperCase())}</h1>
                <AdminApplications applications={data.applications} {type} />
            </div>
        {/each}
    </div>
{:else}
    <div class="p-5 md:p-11" in:fade>
        <h1 class="text-3xl font-bold md:text-4xl">Clan War League</h1>
        <CWLApplications applications={data.cwlApplications} />
    </div>
{/if}
