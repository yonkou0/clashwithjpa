<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import type { APIPlayer } from "$lib/coc/types";
    import type { SelectClanApplication } from "$lib/server/schema";
    import { Tooltip } from "bits-ui";
    import { expoIn, expoOut } from "svelte/easing";
    import { fade, fly, slide } from "svelte/transition";
    import LineMdChevronSmallDown from "~icons/line-md/chevron-small-down";
    import LineMdChevronSmallRight from "~icons/line-md/chevron-small-right";
    import MaterialSymbolsCheckRounded from "~icons/material-symbols/check-rounded";
    import MaterialSymbolsCloseRounded from "~icons/material-symbols/close-rounded";
    import CocButton from "../CocButton.svelte";
    import { toast } from "../toast";

    interface Props {
        applications: SelectClanApplication[];
        type: "pending" | "accepted" | "rejected";
    }
    let { applications, type }: Props = $props();

    function sortApps() {
        const sortedApps = Object.entries(
            applications.reduce((acc: { [key: string]: typeof applications }, app) => {
                if (app.status === type) {
                    const date = new Date(app.createdAt).toLocaleString("en-IN", { month: "long", day: "numeric", year: "numeric" });
                    if (!acc[date]) acc[date] = [];
                    acc[date].push(app);
                }
                return acc;
            }, {})
        );
        sortedApps.sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());
        return sortedApps;
    }

    let sortedApps = $state(sortApps());
    $effect(() => {
        sortedApps = sortApps();
    });

    let hidden: boolean[] = $state(
        Array(applications.filter((app) => app.status === type).length)
            .fill(false)
            .map((_, i) => (i === 0 ? false : true))
    );
    let hiddenInfo: boolean[] = $state(Array(applications.filter((app) => app.status === type).length).fill(true));
    $inspect(hiddenInfo);
    let disabled: boolean = $state(false);

    async function fetchPlayerInfo(tag: string): Promise<APIPlayer | null> {
        const resp = await fetch(`/admin/api/player?tag=${encodeURIComponent(tag)}`);
        if (resp.ok) {
            const plInfo: APIPlayer = await resp.json();
            return plInfo;
        } else {
            throw new Error("Failed to fetch player info");
        }
    }

    async function handleApplication(tag: string, name: string, status: "accepted" | "rejected", discordId: string = "") {
        disabled = true;
        const body: { status: "accepted" | "rejected"; discordId?: string } = { status: status };
        if (status === "accepted") body["discordId"] = discordId;
        let response = await fetch(`/admin/api/applications/${encodeURIComponent(tag)}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            toast.success(`${status.charAt(0).toUpperCase() + status.slice(1)} application of ${name}`);
            invalidateAll();
        } else {
            toast.error(`Failed to ${type} application`);
        }
        setTimeout(() => {
            disabled = false;
        }, 500);
    }
</script>

<ul class="mt-5 flex flex-col gap-5">
    {#if sortedApps.length === 0}
        <p class="text-gray-500">No {type} applications found</p>
    {:else}
        {#each sortedApps as [date, apps], idx}
            {#if apps.length > 0}
                <li class="flex w-full flex-col items-start justify-center">
                    <button class="flex w-full items-center text-gray-500" onclick={() => (hidden[idx] = !hidden[idx])}>
                        {#if hidden[idx]}
                            <span>
                                <LineMdChevronSmallRight class="size-fit" />
                            </span>
                        {:else}
                            <span>
                                <LineMdChevronSmallDown class="size-fit" />
                            </span>
                        {/if}
                        {date}
                        <span class="mx-2 grow rounded-xl border-t border-gray-500"></span>
                        {apps.length}
                        {apps.length > 1 ? "Applications" : "Application"}
                    </button>
                    {#if !hidden[idx]}
                        <ul transition:slide class="mt-2 flex w-full flex-wrap items-start justify-start gap-2">
                            {#each apps as application, idx}
                                <div
                                    in:fly={{ duration: 500, easing: expoIn, x: -100, y: 0 }}
                                    out:fly={{ duration: 500, easing: expoOut, x: 100, y: 0 }}
                                    class="flex w-fit flex-col items-center justify-center gap-5 rounded-xl border border-gray-700 bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 p-4"
                                >
                                    <div class="flex w-full items-center justify-between gap-5">
                                        <div class="flex items-center justify-center gap-1">
                                            <img
                                                src="/townhall/{application.playerData.townHallLevel}.webp"
                                                alt="Town Hall"
                                                class="size-15 rounded-lg"
                                            />
                                            <span class="flex flex-col items-start justify-center">
                                                <Tooltip.Provider>
                                                    <Tooltip.Root delayDuration={200}>
                                                        <Tooltip.Trigger class="cursor-default">
                                                            <p>
                                                                {application.playerData.name.length >= 6
                                                                    ? `${application.playerData.name.slice(0, 6).trim()}...`
                                                                    : application.playerData.name}
                                                            </p>
                                                        </Tooltip.Trigger>
                                                        <Tooltip.Content
                                                            class="rounded-lg border border-gray-700 bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 p-2 text-sm"
                                                        >
                                                            <p>{application.playerData.name}</p>
                                                        </Tooltip.Content>
                                                    </Tooltip.Root>
                                                </Tooltip.Provider>
                                                <p class="text-xs">{application.tag}</p>
                                            </span>
                                        </div>
                                        <p class="text-gray-400">
                                            {new Date(application.createdAt).toLocaleTimeString("en-IN", {
                                                hour: "numeric",
                                                minute: "numeric"
                                            })}
                                        </p>
                                    </div>
                                    <div class="flex w-full flex-col items-center justify-center text-sm text-gray-400">
                                        <button
                                            onclick={() => (hiddenInfo[idx] = !hiddenInfo[idx])}
                                            class="flex w-full items-center justify-center gap-1"
                                        >
                                            <span class="grow rounded-xl border-t border-gray-400"></span>
                                            {#if hiddenInfo[idx]}
                                                <span>
                                                    <LineMdChevronSmallRight class="size-fit" />
                                                </span>
                                            {:else}
                                                <span>
                                                    <LineMdChevronSmallDown class="size-fit" />
                                                </span>
                                            {/if}
                                            Player Data
                                            <span class="grow rounded-xl border-t border-gray-400"></span>
                                        </button>
                                        {#if !hiddenInfo[idx]}
                                            {#await fetchPlayerInfo(application.tag)}
                                                <div in:slide class="flex w-full flex-col items-start justify-center gap-1">
                                                    {#each new Array(3) as _}
                                                        <div class="flex w-full animate-pulse items-center justify-start gap-1">
                                                            <div class="size-6 shrink-0 rounded-xs bg-gray-500"></div>
                                                            <div class="h-4 w-2/3 rounded-md bg-gray-500"></div>
                                                        </div>
                                                    {/each}
                                                </div>
                                            {:then playerInfo}
                                                <div transition:fade class="flex w-full flex-col items-start justify-center gap-1">
                                                    <div class="flex w-full items-center justify-start gap-1">
                                                        <img src="/labels/attacks.webp" alt="Donations" class="size-6" />
                                                        <p class="text-gray-300">
                                                            Attack Wins: {playerInfo?.attackWins}
                                                        </p>
                                                    </div>
                                                    <div class="flex w-full items-center justify-start gap-1">
                                                        <img src="/labels/donations.webp" alt="Donations" class="size-6" />
                                                        <p class="text-gray-300">
                                                            Donations: {playerInfo?.donations}
                                                        </p>
                                                    </div>
                                                    <div class="flex w-full items-center justify-start gap-1">
                                                        <img src="/labels/trophypushing.webp" alt="Donations" class="size-6" />
                                                        <p class="text-gray-300">
                                                            Best Trophies: {playerInfo?.bestTrophies}
                                                        </p>
                                                    </div>
                                                </div>
                                            {:catch error}
                                                <div transition:slide class="flex w-full items-center justify-center gap-1">
                                                    <p class="text-red-400">{error.message}</p>
                                                </div>
                                            {/await}
                                        {/if}
                                    </div>
                                    <div class="flex w-full items-center justify-evenly gap-5">
                                        {#if type !== "accepted"}
                                            <CocButton
                                                type="success"
                                                size="sm"
                                                class="w-full"
                                                {disabled}
                                                onclick={async () => {
                                                    await handleApplication(
                                                        application.tag,
                                                        application.playerData.name,
                                                        "accepted",
                                                        application.discordId
                                                    );
                                                }}
                                            >
                                                <MaterialSymbolsCheckRounded class="size-6" />
                                                Accept
                                            </CocButton>
                                        {/if}
                                        {#if type !== "rejected"}
                                            <CocButton
                                                type="danger"
                                                size="sm"
                                                class="w-full"
                                                {disabled}
                                                onclick={async () => {
                                                    await handleApplication(application.tag, application.playerData.name, "rejected");
                                                }}
                                            >
                                                <MaterialSymbolsCloseRounded class="size-6" />
                                                Reject
                                            </CocButton>
                                        {/if}
                                    </div>
                                </div>
                            {/each}
                        </ul>
                    {/if}
                </li>
            {/if}
        {/each}
    {/if}
</ul>
