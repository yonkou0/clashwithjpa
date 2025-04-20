<script lang="ts">
    import { dev } from "$app/environment";
    import { page } from "$app/state";
    import { PUBLIC_TURNSTILE_SITE_KEY } from "$env/static/public";
    import Button from "$lib/components/Button.svelte";
    import { toast } from "$lib/components/toast";
    import { cwlApplicationSchema } from "$lib/schema";
    import { Switch } from "bits-ui";
    import { Control, Description, Field, FieldErrors } from "formsnap";
    import { Turnstile } from "svelte-turnstile";
    import { fade, fly } from "svelte/transition";
    import SuperDebug, { superForm } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import TablerLoader2 from "~icons/tabler/loader-2";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();

    const form = superForm(data.form, {
        validators: zodClient(cwlApplicationSchema),
        onUpdated() {
            reset?.();
        }
    });
    $effect(() => {
        if (data.userAccount.cocAccounts.length <= 1) {
            $formData.preferenceNum = 1;
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

    let reset = $state<() => void>();

    let buttonDisabled = $derived.by(() => {
        return dev ? false : !$formData.tag || !$formData.preferenceNum || !$formData["cf-turnstile-response"];
    });
</script>

<svelte:head>
    <title>JPA | CWL Application</title>
</svelte:head>

<main class="flex size-full flex-col items-center justify-center">
    <div class="flex h-screen w-screen items-center justify-center lg:justify-start">
        <div
            class="fixed -z-10 h-full w-full items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat lg:relative lg:z-10 lg:flex lg:w-1/2"
            style="background-image: url('/cwl.webp');"
        >
            {#if dev}
                <div class="w-full p-5">
                    <SuperDebug data={$formData} />
                </div>
            {/if}
        </div>
        <div
            class="flex size-full flex-col items-center justify-center bg-gray-950/50 backdrop-blur-xs lg:w-1/2 lg:bg-transparent lg:backdrop-blur-none"
        >
            {#await data.cocData}
                <div class="flex w-full max-w-lg items-center justify-center px-5">
                    <TablerLoader2 class="size-10 animate-spin" />
                </div>
            {:then coc}
                <form in:fade method="POST" action="/cwl" use:enhance class="flex w-full max-w-lg flex-col gap-2 px-5">
                    <Field {form} name="isAlt">
                        <div class="flex items-center justify-start gap-2">
                            <Description>Non FWA Account?</Description>
                            <Control>
                                {#snippet children({ props })}
                                    <Switch.Root
                                        {...props}
                                        name="CWLStatus"
                                        bind:checked={$formData.isAlt}
                                        class="inline-flex h-7 w-[50px] cursor-pointer items-center gap-11 rounded-full bg-gray-800 p-1 transition-all disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-green-600"
                                    >
                                        <Switch.Thumb
                                            class="data-[state=unchecked]:-translate-x-0.3 pointer-events-none block size-6 shrink-0 rounded-full bg-gray-50 transition-all data-[state=checked]:translate-x-[80%]"
                                        />
                                    </Switch.Root>
                                {/snippet}
                            </Control>
                            <FieldErrors class="text-red-400" />
                        </div>
                    </Field>

                    <Field {form} name="tag">
                        <Description>Select one of your accounts</Description>
                        <Control>
                            {#snippet children({ props })}
                                <select {...props} bind:value={$formData.tag}>
                                    <option value="" disabled selected hidden>Select an account</option>
                                    {#each coc as account}
                                        <option class="bg-gray-900" value={account?.tag}>{account?.tag} - {account?.name}</option>
                                    {/each}
                                </select>
                            {/snippet}
                        </Control>
                        <FieldErrors class="text-red-400" />
                    </Field>

                    <Field {form} name="preferenceNum">
                        {@const accounts = data.userAccount.cocAccounts.length}
                        <Description>Preference number {accounts > 1 ? `( 1 - ${accounts} )` : ``}</Description>
                        <Control>
                            {#snippet children({ props })}
                                <input
                                    {...props}
                                    type="number"
                                    placeholder="1"
                                    min="1"
                                    max={accounts}
                                    disabled={accounts <= 1}
                                    bind:value={$formData.preferenceNum}
                                />
                            {/snippet}
                        </Control>
                        <FieldErrors class="text-red-400" />
                    </Field>

                    {#if $formData.isAlt}
                        <Field {form} name="accountClan">
                            <Description>Clan Name</Description>
                            <Control>
                                {#snippet children({ props })}
                                    <select {...props} bind:value={$formData.accountClan}>
                                        <option value={undefined} disabled selected hidden>Select a clan</option>
                                        {#each data.clanNames as clanName}
                                            <option class="bg-gray-900" value={clanName.clanName}>{clanName.clanName}</option>
                                        {/each}
                                        <option class="bg-gray-900" value="other">Other</option>
                                    </select>
                                {/snippet}
                            </Control>
                            <FieldErrors class="text-red-400" />
                        </Field>

                        <Field {form} name="accountWeight">
                            <Description>Account Weight</Description>
                            <Control>
                                {#snippet children({ props })}
                                    <input {...props} type="number" placeholder="0" min={0} bind:value={$formData.accountWeight} />
                                {/snippet}
                            </Control>
                            <FieldErrors class="text-red-400" />
                        </Field>
                    {/if}

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

                    <Button class="px-4 py-3 text-sm {$delayed ? 'cursor-wait' : ''}" disabled={buttonDisabled || $delayed} type="submit">
                        {#if $delayed}
                            <span in:fly class="flex size-full items-center justify-center gap-2">
                                <TablerLoader2 class="size-5 animate-spin"></TablerLoader2>
                                Submitting...
                            </span>
                        {:else}
                            <span in:fly class="flex size-full items-center justify-center">Submit</span>
                        {/if}
                    </Button>
                </form>
            {/await}
        </div>
    </div>
</main>
