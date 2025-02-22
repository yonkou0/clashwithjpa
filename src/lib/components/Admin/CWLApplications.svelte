<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import type { SelectCWL } from "$lib/server/schema";
    import { Popover, Tooltip } from "bits-ui";
    import { expoIn, expoOut } from "svelte/easing";
    import { fly, slide } from "svelte/transition";
    import LineMdChevronSmallDown from "~icons/line-md/chevron-small-down";
    import LineMdChevronSmallRight from "~icons/line-md/chevron-small-right";
    import LogosDiscordIcon from "~icons/logos/discord-icon";
    import MaterialSymbolsCloseRounded from "~icons/material-symbols/close-rounded";
    import CocButton from "../CocButton.svelte";
    import { toast } from "../toast";
    import UserInfo from "../UserInfo.svelte";

    interface Props {
        applications: SelectCWL[];
    }
    let { applications }: Props = $props();

    function sortApps() {
        const sortedApps = Object.entries(
            applications.reduce((acc: { [key: string]: typeof applications }, app) => {
                const date = new Date(app.appliedAt).toLocaleString("en-IN", { month: "long", day: "numeric", year: "numeric" });
                if (!acc[date]) acc[date] = [];
                acc[date].push(app);
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
        Array(applications.length)
            .fill(false)
            .map((_, i) => (i === 0 ? false : true))
    );
    let disabled: boolean = $state(false);

    async function removeApp(tag: string, name: string) {
        disabled = true;
        let response = await fetch(`/admin/api/applications/${encodeURIComponent(tag)}?cwl=true`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
        });
        if (response.ok) {
            toast.success(`Removed application of ${name}`);
            invalidateAll();
        } else {
            toast.error("Failed to remove application");
        }
        setTimeout(() => {
            disabled = false;
        }, 500);
    }
</script>

<ul class="mt-5 flex flex-col gap-5">
    {#if sortedApps.length === 0}
        <p class="text-gray-500">No application found</p>
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
                        <ul transition:slide class="mt-2 flex w-full flex-wrap items-start justify-center gap-2 md:justify-start">
                            {#each apps as application, appIdx}
                                <div
                                    in:fly={{ duration: 500, easing: expoIn, x: -100, y: 0 }}
                                    out:fly={{ duration: 500, easing: expoOut, x: 100, y: 0 }}
                                    class="flex w-80 flex-col items-center justify-center gap-5 rounded-xl border border-gray-700 bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 p-4"
                                >
                                    <div class="flex w-full flex-col items-start justify-center gap-5">
                                        <div class="flex w-full flex-col items-start justify-center">
                                            <div class="flex w-full items-start justify-between gap-5">
                                                <Tooltip.Provider>
                                                    <Tooltip.Root delayDuration={200}>
                                                        <Tooltip.Trigger class="cursor-default">
                                                            <p>
                                                                {application.accountName.length >= 10
                                                                    ? `${application.accountName.slice(0, 10).trim()}...`
                                                                    : application.accountName}
                                                            </p>
                                                        </Tooltip.Trigger>
                                                        <Tooltip.Content
                                                            class="rounded-lg border border-gray-700 bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 p-2 text-sm"
                                                        >
                                                            <p>{application.accountName}</p>
                                                        </Tooltip.Content>
                                                    </Tooltip.Root>
                                                </Tooltip.Provider>
                                                <p class="text-gray-400">
                                                    {new Date(application.appliedAt).toLocaleTimeString("en-IN", {
                                                        hour: "numeric",
                                                        minute: "numeric"
                                                    })}
                                                </p>
                                            </div>
                                            <p class="text-sm">{application.accountTag}</p>
                                        </div>
                                        <div class="flex w-full flex-col items-start justify-center">
                                            <span class="flex w-full items-center justify-start gap-1 text-sm">
                                                <img src="/emoji/clan.webp" alt="Donations" class="w-5.5" />
                                                <p>Clan: {application.accountClan}</p>
                                            </span>
                                            <span class="flex w-full items-center justify-start gap-1 text-sm">
                                                <img src="/emoji/accweight.webp" alt="Donations" class="w-5.5" />
                                                <p>Acc Weight: {application.accountWeight}</p>
                                            </span>
                                            <span class="flex w-full items-center justify-start gap-1 text-sm">
                                                <LogosDiscordIcon class="size-6" />
                                                <Popover.Root>
                                                    <Popover.Trigger>
                                                        Discord:
                                                        <span
                                                            class="bg-blurple/50 text-blurple-light hover:bg-blurple rounded-md p-0.5 font-sans transition-colors hover:text-gray-50"
                                                        >
                                                            @{application.userName.length >= 10
                                                                ? `${application.userName.slice(0, 10).trim()}...`
                                                                : application.userName}
                                                        </span>
                                                    </Popover.Trigger>
                                                    <Popover.Content class="z-20 max-w-80 rounded-xl p-2">
                                                        <UserInfo userID={application.userId} />
                                                    </Popover.Content>
                                                </Popover.Root>
                                            </span>
                                        </div>
                                    </div>
                                    <CocButton
                                        type="danger"
                                        size="sm"
                                        class="w-full"
                                        {disabled}
                                        onclick={async () => {
                                            await removeApp(application.accountTag, application.accountName);
                                        }}
                                    >
                                        <MaterialSymbolsCloseRounded class="size-6" />
                                        Remove
                                    </CocButton>
                                </div>
                            {/each}
                        </ul>
                    {/if}
                </li>
            {/if}
        {/each}
    {/if}
</ul>
