<script lang="ts">
    import type { PageData } from "./$types";
    import { page } from "$app/state";
    import { dev } from "$app/environment";
    import { PUBLIC_TURNSTILE_SITE_KEY } from "$env/static/public";
    import { toast } from "$lib/components/toast";
    import Button from "$lib/components/Button.svelte";
    import { cwlApplicationSchema } from "$lib/schema";
    import { Tooltip } from "bits-ui";
    import { Control, Description, Field, FieldErrors } from "formsnap";
    import { Turnstile } from "svelte-turnstile";
    import SuperDebug, { superForm } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import TablerLoader2 from "~icons/tabler/loader-2";
    import { fade, fly } from "svelte/transition";

    let { data }: { data: PageData } = $props();

    const form = superForm(data.form, {
        validators: zodClient(cwlApplicationSchema),
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

    let reset = $state<() => void>();

    let buttonDisabled = $derived.by(() => {
        return dev ? false : !$formData.tag || !$formData.preferenceNum || !$formData["cf-turnstile-response"];
    });
</script>

<svelte:head>
    <title>CWL Applications | JPA</title>
</svelte:head>

<div class="mt-32 flex flex-col gap-4 p-8">
    {#if dev}
        <div class="w-full">
            <SuperDebug data={$formData} />
        </div>
    {/if}

    <form method="POST" action="/cwl" use:enhance class="flex w-full max-w-lg flex-col gap-2 px-5">
        <Field {form} name="tag">
            <Description>Select one of your accounts</Description>
            <Control>
                {#snippet children({ props })}
                    <select class="rounded-lg border border-gray-700 text-black" {...props} bind:value={$formData.tag}>
                        <option value="" disabled selected hidden>Select an account</option>
                        {#each data.userAccount.cocAccounts as account}
                            <option value={account.tag}>{account.tag}</option>
                        {/each}
                    </select>
                {/snippet}
            </Control>
            <FieldErrors class="text-red-400" />
        </Field>

        <Field {form} name="preferenceNum">
            {@const accounts = data.userAccount.cocAccounts.length}
            <Description>Preference number ( 1 - {accounts} )</Description>
            <Control>
                {#snippet children({ props })}
                    <input
                        {...props}
                        class="rounded-lg border border-gray-700 p-2"
                        type="number"
                        placeholder="1"
                        min="1"
                        max={accounts}
                        bind:value={$formData.preferenceNum}
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
</div>
