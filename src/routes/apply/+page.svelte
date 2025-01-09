<script lang="ts">
    import { dev } from "$app/environment";
    import { page } from "$app/state";
    import { PUBLIC_TURNSTILE_SITE_KEY } from "$env/static/public";
    import Button from "$lib/components/Button.svelte";
    import { toast } from "$lib/components/toast";
    import { clanApplicationSchema } from "$lib/schema";
    import { Tooltip } from "bits-ui";
    import { Control, Description, Field, FieldErrors } from "formsnap";
    import { Turnstile } from "svelte-turnstile";
    import { expoOut } from "svelte/easing";
    import { fade, fly } from "svelte/transition";
    import SuperDebug, { superForm } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import MaterialSymbolsCancelRounded from "~icons/material-symbols/cancel-rounded";
    import MaterialSymbolsCheckCircle from "~icons/material-symbols/check-circle";
    import MaterialSymbolsChevronLeftRounded from "~icons/material-symbols/chevron-left-rounded";
    import MaterialSymbolsChevronRightRounded from "~icons/material-symbols/chevron-right-rounded";
    import MaterialSymbolsWarningRounded from "~icons/material-symbols/warning-rounded";
    import info from "../../../data/info.json";
    import type { PageData } from "./$types";
    import TablerLoader2 from "~icons/tabler/loader-2";

    let { data }: { data: PageData } = $props();

    const form = superForm(data.form, {
        validators: zodClient(clanApplicationSchema),
        onUpdated() {
            reset?.();
        }
    });
    const { form: formData, enhance, message, delayed } = form;
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

    let buttonDisabled = $derived.by(() => {
        return dev ? false : !$formData.tag || !$formData.apiToken || !$formData["cf-turnstile-response"];
    });

    let showPrevApps: boolean = $state(false);

    let pendingApps = $derived.by(() => {
        return Object.keys(data.applications.filter((app) => app.status === "pending")).length;
    });

    let reset = $state<() => void>();
</script>

<svelte:head>
    <title>JPA | Apply</title>
</svelte:head>

<main class="flex size-full flex-col items-center justify-center">
    {#if data.user && !data.user.inGuild}
        <div class="flex flex-col items-center justify-center">
            <iframe
                class="fixed bottom-5 right-5 hidden h-full pt-28 lg:block"
                title="Discord Widget"
                src="https://discord.com/widget?id={info.guildID}&theme=dark"
                allowtransparency={true}
                frameborder="0"
                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
            >
            </iframe>
            <p class="text-center text-2xl font-bold">Join the server to apply</p>
            <Button href="https://discord.clashwithjpa.com" class="mt-5" size="md">Join Server</Button>
        </div>
    {:else}
        <div class="flex h-screen w-screen items-center justify-center lg:justify-start">
            <!-- Image -->
            <div
                class="z-10 hidden h-full w-1/2 items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat lg:flex"
                style="background-image: url('/forms.webp');"
            >
                {#if dev}
                    <div class="w-full p-5">
                        <SuperDebug data={$formData} />
                    </div>
                {/if}
            </div>
            <!-- Forms -->
            <div class="flex size-full flex-col items-center justify-center lg:w-1/2">
                {#if data.applications.length && showPrevApps}
                    <div in:fade class="flex size-full flex-col justify-center">
                        <h3 class="text-center">Previous Application{data.applications.length > 1 ? "s" : ""}</h3>
                        <ul class="mt-5 flex max-h-[60%] flex-col gap-2 overflow-y-scroll rounded-lg px-5">
                            {#each Object.entries(data.applications.reduce((acc: { [key: string]: typeof data.applications }, app) => {
                                    const date = new Date(app.createdAt).toLocaleString("en-IN", { month: "long", day: "numeric", year: "numeric" });
                                    if (!acc[date]) acc[date] = [];
                                    acc[date].push(app);
                                    return acc;
                                }, {})) as [date, applications]}
                                <li class="flex w-full flex-col items-start justify-center">
                                    <p class="flex w-full items-center text-gray-500">
                                        {date}
                                        <span class="mx-2 flex-grow rounded-lg border-t border-gray-500"></span>
                                    </p>
                                    <ul class="mt-2 flex w-full flex-wrap items-center justify-center gap-2">
                                        {#each applications as application}
                                            <div
                                                class="flex w-fit items-center justify-between gap-5 rounded-lg border border-gray-700 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-4"
                                            >
                                                <div class="flex items-center justify-center gap-1">
                                                    <span
                                                        class:text-red-400={application.status === "rejected"}
                                                        class:text-yellow-400={application.status === "pending"}
                                                        class:text-green-400={application.status === "approved"}
                                                    >
                                                        <Tooltip.Provider>
                                                            <Tooltip.Root delayDuration={200}>
                                                                <Tooltip.Trigger class="cursor-default">
                                                                    {#if application.status === "approved"}
                                                                        <MaterialSymbolsCheckCircle class="size-10" />
                                                                    {:else if application.status === "rejected"}
                                                                        <MaterialSymbolsCancelRounded class="size-10" />
                                                                    {:else if application.status === "pending"}
                                                                        <MaterialSymbolsWarningRounded class="size-10" />
                                                                    {/if}
                                                                </Tooltip.Trigger>
                                                                <Tooltip.Content
                                                                    class="rounded-lg border border-gray-700 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-2 text-sm"
                                                                >
                                                                    {application.status.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase())}
                                                                </Tooltip.Content>
                                                            </Tooltip.Root>
                                                        </Tooltip.Provider>
                                                    </span>
                                                    <span class="flex flex-col items-start justify-center">
                                                        <Tooltip.Provider>
                                                            <Tooltip.Root delayDuration={200}>
                                                                <Tooltip.Trigger class="cursor-default">
                                                                    <p class="w-24 truncate">{application.playerData.name}</p>
                                                                </Tooltip.Trigger>
                                                                <Tooltip.Content
                                                                    class="rounded-lg border border-gray-700 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-2 text-sm"
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
                                        {/each}
                                    </ul>
                                </li>
                            {/each}
                        </ul>
                    </div>
                {:else}
                    <form in:fade method="POST" action="/apply" use:enhance class="flex w-full max-w-lg flex-col gap-2 px-5">
                        <Field {form} name="tag">
                            <Description>Your account tag (include #)</Description>
                            <Control>
                                {#snippet children({ props })}
                                    <input
                                        {...props}
                                        type="text"
                                        placeholder="#ABCDEFGHI"
                                        bind:value={$formData.tag}
                                        class="rounded-lg text-gray-700"
                                    />
                                {/snippet}
                            </Control>
                            <FieldErrors class="text-red-400" />
                        </Field>
                        <Field {form} name="apiToken">
                            <Description>Your API token</Description>
                            <Control>
                                {#snippet children({ props })}
                                    <input
                                        {...props}
                                        type="text"
                                        placeholder="API Token"
                                        bind:value={$formData.apiToken}
                                        class="rounded-lg text-gray-700"
                                    />
                                {/snippet}
                            </Control>
                            <FieldErrors class="text-red-400" />
                        </Field>
                        {#if !dev}
                            <Field {form} name="cf-turnstile-response">
                                <Turnstile
                                    class="text-center"
                                    on:callback={(event) => {
                                        $formData["cf-turnstile-response"] = event.detail.token;
                                    }}
                                    siteKey={PUBLIC_TURNSTILE_SITE_KEY}
                                    bind:reset
                                />
                            </Field>
                        {/if}
                        <button
                            disabled={buttonDisabled || $delayed}
                            type="submit"
                            class="mt-4 flex items-center justify-center rounded-lg bg-white px-4 py-3 text-gray-800 transition-all duration-200 hover:bg-gray-200 disabled:bg-gray-400"
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
                {/if}
                {#if data.applications.length}
                    <div class="fixed bottom-0 w-full max-w-lg p-5 lg:w-1/2">
                        <button
                            class="group w-full rounded-lg border border-gray-700 px-4 py-3 text-sm text-gray-500"
                            onclick={() => (showPrevApps = !showPrevApps)}
                        >
                            {#if showPrevApps}
                                <span in:fly={{ duration: 500, easing: expoOut, x: -100, y: 0 }} class="flex items-center justify-center gap-2">
                                    <MaterialSymbolsChevronLeftRounded class="size-6 transition-transform group-hover:-translate-x-1.5 " />
                                    <span>Back to form</span>
                                </span>
                            {:else}
                                <span in:fly={{ duration: 500, easing: expoOut, x: 100, y: 0 }} class="flex items-center justify-center gap-2">
                                    <span>
                                        {#if pendingApps}
                                            {pendingApps} Pending
                                        {:else}
                                            Check
                                        {/if} application{data.applications.length > 1 ? "s" : ""}
                                    </span>
                                    <MaterialSymbolsChevronRightRounded class="size-6 transition-transform group-hover:translate-x-1.5 " />
                                </span>
                            {/if}
                        </button>
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</main>
