<script lang="ts">
    import { dev } from "$app/environment";
    import { page } from "$app/state";
    import { PUBLIC_TURNSTILE_SITE_KEY } from "$env/static/public";
    import Button from "$lib/components/Button.svelte";
    import { toast } from "$lib/components/toast";
    import { clanApplicationSchema } from "$lib/schema";
    import { Control, Description, Field, FieldErrors } from "formsnap";
    import { Turnstile } from "svelte-turnstile";
    import SuperDebug, { superForm } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import info from "../../../data/info.json";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();

    const form = superForm(data.form, {
        validators: zodClient(clanApplicationSchema),
        onUpdated() {
            reset?.();
        }
    });
    const { form: formData, enhance, message } = form;
    $effect(() => {
        if ($message && page.status === 200) {
            toast.success($message);
        } else if ($message && page.status === 400) {
            if ($message === "Already in guild") {
                toast.error("You are already in the guild");
            } else {
                toast.error("There was an error submitting your application");
            }
        }
    });

    let buttonDisabled = $derived.by(() => {
        return !$formData.tag || !$formData.apiToken || !$formData["cf-turnstile-response"];
    });

    let reset = $state<() => void>();
</script>

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
        <div class="flex w-screen items-center justify-center lg:justify-start">
            <!-- Image -->
            <div
                class="z-10 hidden h-screen w-1/2 overflow-hidden bg-cover bg-center bg-no-repeat lg:flex items-center justify-center"
                style="background-image: url('/forms.webp');"
            >
                {#if dev}
                    <div class="w-full p-5">
                        <SuperDebug data={$formData} />
                    </div>
                {/if}
            </div>
            <!-- Forms -->
            <div class="flex items-center justify-center px-5 lg:w-1/2">
                <form method="POST" action="/apply" use:enhance class="flex w-full max-w-lg flex-col gap-2">
                    <Field {form} name="tag">
                        <Description>Your account tag (include #)</Description>
                        <Control>
                            {#snippet children({ props })}
                                <input {...props} type="text" placeholder="#ABCDEFGHI" bind:value={$formData.tag} class="rounded-xl text-gray-700" />
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
                                    class="rounded-xl text-gray-700"
                                />
                            {/snippet}
                        </Control>
                        <FieldErrors class="text-red-400" />
                    </Field>
                    <Field {form} name="cf-turnstile-response">
                        <Turnstile
                            class="text-center"
                            on:callback={(event) => {
                                $formData["cf-turnstile-response"] = event.detail.token;
                            }}
                            on:expired={() => {
                                reset?.();
                            }}
                            siteKey={PUBLIC_TURNSTILE_SITE_KEY}
                            bind:reset
                        />
                    </Field>
                    <button disabled={buttonDisabled} type="submit" class="mt-4 rounded-xl bg-white px-4 py-3 text-gray-800 disabled:bg-gray-400">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    {/if}
</main>
