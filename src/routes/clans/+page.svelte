<script lang="ts">
    import { getClanTags } from "$lib/clans/info";
    import type { PageData } from "./$types";
    import type { ClanTagsType } from "$lib/clans/types";
    import H1 from "$lib/components/H1.svelte";
    import InlineLink from "$lib/components/InlineLink.svelte";
    import PhArrowUpRightBold from "~icons/ph/arrow-up-right-bold";
    import IonSkull from "~icons/ion/skull";
    import { fade } from "svelte/transition";

    let clanTags: ClanTagsType = getClanTags();
    let { data }: { data: PageData } = $props();
</script>

<svelte:head>
    <title>JPA | Clans</title>
</svelte:head>

<div class="flex size-full flex-col">
    <header class="top-0 w-full">
        <div class="z-10 h-full w-full overflow-hidden bg-cover bg-fixed bg-center" style="background-image: url('/clans_header.webp');">
            <div class="flex h-full items-center bg-gray-950/40">
                <div class="flex flex-grow flex-col items-start space-y-10 px-5 pb-5 mt-32 md:px-24 lg:px-32">
                    <H1 class="text-4xl lg:text-5xl">JPA Clans</H1>
                    <p class="max-w-2xl text-base font-medium md:text-lg">
                        With over {Object.keys(clanTags).length} clans we have a place for everyone.
                        {#await data.data}
                            <span in:fade={{ duration: 200 }} class="inline-flex items-center space-x-2">
                                <span>Clans range from</span>
                                <span class="inline-block h-4 w-8 animate-pulse rounded-md bg-gray-100"></span>
                                <span>to</span>
                                <span class="inline-block h-4 w-8 animate-pulse rounded-md bg-gray-100"></span>
                                <span>.</span>
                            </span>
                        {:then clans}
                            <span in:fade={{ duration: 200 }}>
                                {#if clans.length > 0}
                                    Clans range from LVL {Math.min(...clans.map((clan) => clan.clanLevel))} to LVL {Math.max(
                                        ...clans.map((clan) => clan.clanLevel)
                                    )}.
                                {/if}
                            </span>
                        {/await}
                        Each having their own rules and requirements. Find the right clan for you today!
                    </p>
                    <InlineLink
                        href="https://discord.clashwithjpa.com/"
                        class="group mt-4 flex items-center space-x-1 font-semibold transition-all duration-300 ease-in-out"
                        newTab={true}
                    >
                        <span>Join our Discord</span>
                        <PhArrowUpRightBold class="size-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-2" />
                    </InlineLink>
                </div>
            </div>
        </div>
    </header>

    <div class="flex w-full flex-col items-center justify-center p-11">
        {#await data.data}
            <div class="flex w-full flex-wrap items-center justify-center gap-4">
                {#each Array(9) as _}
                    <div class="flex animate-pulse flex-col justify-between rounded-lg border border-gray-700">
                        <div class="flex w-80 items-start space-x-4 rounded-t-lg p-4">
                            <div class="size-20 rounded-md bg-gray-700"></div>
                            <div class="flex flex-col items-start rounded-md">
                                <div class="h-6 w-32 rounded-md bg-gray-700"></div>
                                <div class="mt-1 h-4 w-16 rounded-md bg-gray-700"></div>
                                <div class="mt-1 h-4 w-12 rounded-md bg-gray-700"></div>
                            </div>
                        </div>
                        <div class="flex flex-col border-y border-gray-700 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-4 text-sm">
                            <div class="flex flex-col items-start gap-2">
                                <div class="flex items-center gap-1">
                                    <div class="size-8 min-w-8 rounded-md bg-gray-700"></div>
                                    <div class="h-4 w-16 rounded-md bg-gray-700"></div>
                                </div>
                            </div>
                            <div class="mt-4 flex flex-col items-start gap-2">
                                <div class="h-4 w-24 rounded-md bg-gray-700"></div>
                                <div class="mt-1 h-4 w-24 rounded-md bg-gray-700"></div>
                            </div>
                        </div>
                        <div class="flex w-full flex-col rounded-b-lg">
                            <div class="border-b border-gray-700 p-4 text-center text-sm">
                                <div class="mx-auto h-4 w-32 rounded-md bg-gray-700"></div>
                            </div>
                            <div class="flex w-full flex-col items-start space-y-2 p-4">
                                {#each Array(3) as _}
                                    <div class="flex items-center">
                                        <div class="size-11 rounded-md bg-gray-700"></div>
                                        <div class="ml-2 h-4 w-24 rounded-md bg-gray-700"></div>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {:then clans}
            <div class="flex w-full flex-col items-center">
                <div class="flex w-full flex-wrap items-center justify-center gap-4">
                    {#each clans as clan}
                        <div class="flex flex-col justify-between rounded-lg border border-gray-700">
                            <div class="flex w-80 items-center space-x-4 rounded-t-lg p-4">
                                <img class="size-20" src={clan.badgeUrls.medium} alt={clan.name} />
                                <div class="flex flex-col items-start">
                                    <h2 class="text-xl">{clan.name}</h2>
                                    <p class="text-xs">{clan.tag}</p>
                                    <p class="text-xs">LVL. {clan.clanLevel}</p>
                                </div>
                            </div>
                            <div class="flex flex-col border-y border-gray-700 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-4 text-sm">
                                <div class="flex flex-col items-start gap-2">
                                    <div class="flex items-center gap-1">
                                        <img class="size-8 min-w-8" src="/labels/international.webp" alt="Members" />
                                        <p>{clan.members} Members</p>
                                    </div>
                                </div>
                                <div class="mt-4 flex flex-col items-start gap-2">
                                    <InlineLink
                                        href={`/clans/${clan.tag.replace("#", "")}`}
                                        class="group flex items-center space-x-1 text-xs transition-all duration-300 ease-in-out"
                                    >
                                        <span>Clan Rules</span>
                                        <PhArrowUpRightBold
                                            class="size-3 transition-transform group-hover:-translate-y-1 group-hover:translate-x-2"
                                        />
                                    </InlineLink>
                                    <InlineLink
                                        href={`https://link.clashofclans.com/en?action=OpenClanProfile&tag=${clan.tag}`}
                                        class="group flex items-center space-x-1 text-xs transition-all duration-300 ease-in-out"
                                        newTab={true}
                                    >
                                        <span>Open in Game</span>
                                        <PhArrowUpRightBold
                                            class="size-3 transition-transform group-hover:-translate-y-1 group-hover:translate-x-2"
                                        />
                                    </InlineLink>
                                </div>
                            </div>
                            <div class="flex w-full flex-col rounded-b-lg">
                                <p class="border-b border-gray-700 p-4 text-center text-sm">Minimum Requirements</p>
                                <div class="flex w-full flex-col items-start space-y-2 p-4">
                                    {#each Object.keys(clanTags[clan.tag]) as tag}
                                        <div class="flex items-center">
                                            <img class="size-11" src={`/labels/${tag}.webp`} alt={tag} />
                                            <p class="ml-2">{clanTags[clan.tag][tag]} {tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase()}</p>
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {:catch}
            <div class="flex size-full items-center justify-center gap-2">
                <IonSkull class="size-10" />
                <p class="text-lg">Failed to load clans</p>
            </div>
        {/await}
    </div>
</div>
