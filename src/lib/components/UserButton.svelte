<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import type { UserData } from "$lib/auth/sessionHelper";
    import { goto } from "$app/navigation";

    let { user }: { user: UserData | null } = $props();
</script>

{#if user}
    <button
        onclick={() => {
            goto("/auth/logout");
        }}
    >
        <img src="https://media.discordapp.net/avatars/{user.id}/{user.avatar}.webp" alt="Avatar" class="size-8 rounded-full lg:size-11" />
    </button>
{:else}
    <Button href="/auth/login" size="sm">Login</Button>
{/if}
