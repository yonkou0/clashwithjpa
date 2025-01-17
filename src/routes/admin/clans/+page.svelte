<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import { page } from "$app/state";
    import { clanForm, clanFormSchema } from "$lib/coc/schema";
    import ClanInfo from "$lib/components/ClanInfo.svelte";
    import InlineLink from "$lib/components/InlineLink.svelte";
    import { toast } from "$lib/components/toast";
    import { Popover, Tooltip } from "bits-ui";
    import { Control, Description, Field, FieldErrors } from "formsnap";
    import { expoIn, expoOut } from "svelte/easing";
    import { fade, fly, slide } from "svelte/transition";
    import { superForm } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import MaterialSymbolsCloseRounded from "~icons/material-symbols/close-rounded";
    import MaterialSymbolsKeyboardDoubleArrowDownRounded from "~icons/material-symbols/keyboard-double-arrow-down-rounded";
    import MaterialSymbolsKeyboardDoubleArrowUpRounded from "~icons/material-symbols/keyboard-double-arrow-up-rounded";
    import TablerLoader2 from "~icons/tabler/loader-2";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();

    let reset = $state<() => void>();
    const form = superForm(data.form, {
        validators: zodClient(clanFormSchema),
        onUpdated() {
            reset?.();
        }
    });
    const { form: formData, enhance, message, delayed, errors } = form;
    let openTooltip: boolean[] = $state(Array(Object.keys(clanForm).length).fill(false));
    $effect(() => {
        if ($message && (page.status === 200 || page.status == 400)) {
            switch (page.status) {
                case 200:
                    toast.success($message);
                    break;
                case 400:
                    toast.error($message);
                    break;
            }
        }
    });

    let hidden: boolean[] = $state(Array(data.clans.length).fill(true));
    let disabled: {
        input: boolean;
        button: boolean;
    } = $state({
        input: false,
        button: true
    });
    $effect(() => {
        disabled.input = $delayed;
        disabled.button =
            !Object.values(formData).every((v) => v !== undefined && v !== null) || data.clans.some((clan) => clan.clanTag == $formData.tag);
    });

    async function removeClan(tag: string, name: string | undefined) {
        disabled.input = true;
        disabled.button = true;
        const body = {
            key: "remove_clan",
            value: tag
        };
        let response = await fetch("/admin/api/clans", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            toast.success(`Removed clan ${name || tag}`);
            invalidateAll();
        } else {
            toast.error("Failed to remove clan");
        }
        setTimeout(() => {
            disabled.input = false;
            disabled.button = false;
        }, 2000);
    }
</script>

<div class="flex size-full flex-col gap-5 overflow-auto p-5 md:p-11">
    <h1 class="text-4xl">Add Clan</h1>
    <form in:fade method="POST" action="/admin/clans" use:enhance class="w-full">
        <div class="flex w-full flex-wrap items-start justify-center gap-2">
            {#each Object.keys(clanForm) as key, idx}
                <div class="flex w-full flex-grow cursor-default flex-col gap-2 md:w-fit">
                    <Field {form} name={key as keyof typeof $formData}>
                        <Description>{clanForm[key].desc}</Description>
                        <Tooltip.Provider>
                            <Tooltip.Root delayDuration={0} bind:open={openTooltip[idx]} disableCloseOnTriggerClick>
                                <Tooltip.Trigger class="flex w-full flex-grow">
                                    <Control>
                                        {#snippet children({ props })}
                                            <input
                                                {...props}
                                                onclick={() => (openTooltip[idx] = !openTooltip[idx])}
                                                disabled={disabled.input}
                                                class="w-full rounded-lg border border-gray-700 {$errors[key as keyof typeof $formData]
                                                    ? '!border-red-700'
                                                    : ''}"
                                                type={clanForm[key].type}
                                                placeholder={clanForm[key].placeholder}
                                                bind:value={$formData[key as keyof typeof $formData]}
                                            />
                                        {/snippet}
                                    </Control>
                                </Tooltip.Trigger>
                                <Tooltip.Portal>
                                    <Tooltip.Content
                                        class="rounded-lg border border-gray-700 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-2
                                        {$errors[key as keyof typeof $formData] ? '' : 'hidden'}"
                                    >
                                        <FieldErrors class="text-xs text-red-400" />
                                        <Tooltip.Arrow class="text-slate-700" />
                                    </Tooltip.Content>
                                </Tooltip.Portal>
                            </Tooltip.Root>
                        </Tooltip.Provider>
                    </Field>
                </div>
            {/each}
        </div>
        <button
            disabled={disabled.button || $delayed}
            type="submit"
            class="mt-4 flex w-full items-center justify-center rounded-lg bg-gray-800 p-2 px-4 py-3 transition-all duration-200 hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:!bg-gray-800"
            class:cursor-wait={$delayed}
        >
            {#if $delayed}
                <span in:fly class="flex size-full items-center justify-center gap-2">
                    <TablerLoader2 class="size-5 animate-spin"></TablerLoader2>
                    Submitting...
                </span>
            {:else}
                <span in:fly class="flex size-full items-center justify-center">Submit</span>
            {/if}
        </button>
    </form>
    <h1 class="text-4xl">Clans {data.clans.length}</h1>
    <div class="flex w-full flex-col items-center justify-center">
        <div class="flex w-full flex-col items-center">
            <div class="flex w-full flex-wrap items-start justify-center gap-2 md:justify-start">
                {#each data.clans as clan, idx}
                    <div in:fly={{ duration: 500, easing: expoIn, x: -100, y: 0 }} out:fly={{ duration: 500, easing: expoOut, x: 100, y: 0 }}>
                        <div class="flex flex-col justify-between rounded-xl border border-gray-700">
                            <div class="flex w-80 items-center gap-2 p-4">
                                <img class="size-20" src={clan.clanData?.badgeUrls.medium} alt={clan.clanData?.name} />
                                <div class="flex size-full flex-col items-start">
                                    <div class="flex size-full items-start justify-between">
                                        <h2 class="text-2xl">{clan.clanData?.name}</h2>
                                        <button
                                            class="size-fit rounded-lg bg-slate-800 p-1 transition-all hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-slate-800"
                                            disabled={disabled.input}
                                            onclick={async () => {
                                                await removeClan(clan.clanTag, clan.clanData?.name);
                                            }}
                                        >
                                            <MaterialSymbolsCloseRounded class="size-fit" />
                                        </button>
                                    </div>
                                    <p class="text-sm">{clan.clanData?.tag}</p>
                                    <div class="flex size-full items-start justify-between">
                                        <p class="text-sm">LVL. {clan.clanData?.clanLevel}</p>
                                        <button
                                            class="flex size-fit items-center justify-center rounded-lg bg-slate-800 p-1 transition-all hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-slate-800"
                                            disabled={disabled.input}
                                            onclick={() => (hidden[idx] = !hidden[idx])}
                                        >
                                            {#if hidden[idx]}
                                                <span in:fly class="size-fit">
                                                    <MaterialSymbolsKeyboardDoubleArrowDownRounded class="size-fit" />
                                                </span>
                                            {:else}
                                                <span in:fly class="size-fit">
                                                    <MaterialSymbolsKeyboardDoubleArrowUpRounded class="size-fit" />
                                                </span>
                                            {/if}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {#if !hidden[idx]}
                                <div transition:slide={{ axis: "y" }} class="flex flex-col justify-between transition-opacity">
                                    <div
                                        class="flex flex-col rounded-xl border-y border-gray-700 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-4 text-base"
                                    >
                                        <div class="flex flex-col items-start gap-2">
                                            <div class="flex items-center gap-1">
                                                <img class="size-8 min-w-8" src="/labels/international.webp" alt="Members" />
                                                <p>{clan.clanData?.members} Members</p>
                                            </div>
                                        </div>
                                        <div class="mt-4 flex flex-col items-start gap-2 transition">
                                            <Popover.Root>
                                                <Popover.Trigger class="flex items-center space-x-1 transition-all duration-300 ease-in-out">
                                                    <InlineLink class="text-sm">Clan Info</InlineLink>
                                                </Popover.Trigger>
                                                <Popover.Portal>
                                                    <Popover.Content class="z-20 max-w-80 rounded-xl p-2">
                                                        <div
                                                            class="flex flex-col rounded-xl border border-gray-700 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-4 text-base"
                                                        >
                                                            <ClanInfo {clan} />
                                                        </div>
                                                    </Popover.Content>
                                                </Popover.Portal>
                                            </Popover.Root>
                                            <InlineLink
                                                href={`https://link.clashofclans.com/en?action=OpenClanProfile&tag=${clan.clanData?.tag}`}
                                                arrow={true}
                                                newTab={true}
                                            >
                                                <span>Open in Game</span>
                                            </InlineLink>
                                        </div>
                                    </div>
                                    <div class="flex w-full flex-col">
                                        <p class="p-4 text-center text-base">Minimum Requirements</p>
                                        <div
                                            class="flex w-full flex-col items-start space-y-2 rounded-xl border-t border-gray-700 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-4"
                                        >
                                            <div class="flex items-center">
                                                <img class="size-11" src={`/labels/attacks.webp`} alt="attacks" />
                                                <p class="ml-2">
                                                    {clan.attacksRequirement} Attacks
                                                </p>
                                            </div>
                                            <div class="flex items-center">
                                                <img class="size-11" src={`/labels/donations.webp`} alt="donations" />
                                                <p class="ml-2">
                                                    {clan.donationsRequirement} Donations
                                                </p>
                                            </div>
                                            <div class="flex items-center">
                                                <img class="size-11" src={`/labels/clangames.webp`} alt="clangames" />
                                                <p class="ml-2">
                                                    {clan.clangamesRequirement} Clan Games Points
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>
