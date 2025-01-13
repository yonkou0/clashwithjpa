<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import type { UserData } from "$lib/auth/user";
    import Button from "$lib/components/Button.svelte";
    import { toast } from "$lib/components/toast";
    import { Popover } from "bits-ui";
    import MaterialSymbolsAdminPanelSettingsRounded from "~icons/material-symbols/admin-panel-settings-rounded";
    import MaterialSymbolsCrownRounded from "~icons/material-symbols/crown-rounded";
    import MaterialSymbolsLabProfileRounded from "~icons/material-symbols/lab-profile-rounded";
    import MaterialSymbolsLogoutRounded from "~icons/material-symbols/logout-rounded";
    import MdiSwordCross from "~icons/mdi/sword-cross";

    let { user, applicationEnabled }: { user: UserData | null; applicationEnabled: boolean } = $props();

    async function logout() {
        try {
            await fetch("/auth/logout");
            toast.success("Logged out successfully");
            invalidateAll();
        } catch {
            toast.error("Failed to logout");
        }
    }
</script>

{#if user}
    <Popover.Root>
        <Popover.Trigger>
            {#if user.isAdmin}
                <MaterialSymbolsCrownRounded class="-mb-2 size-6 -rotate-[15deg] text-yellow-400" />
            {/if}
            <img src="https://media.discordapp.net/avatars/{user.id}/{user.avatar}.webp" alt="Avatar" class="size-8 rounded-full lg:size-11" />
        </Popover.Trigger>
        <Popover.Portal>
            <Popover.Content class="z-20 max-w-80 rounded-xl p-2">
                <div
                    class="flex flex-col gap-5 rounded-xl border border-gray-950 bg-gradient-to-b from-gray-800 via-gray-800 to-gray-900 p-5 shadow-[0_0_5px_0.5px_var(--tw-shadow-color)] shadow-gray-950 backdrop-blur-md"
                >
                    <div class="flex gap-x-5">
                        <Button onclick={logout} class="p-2" type="danger">
                            <MaterialSymbolsLogoutRounded class="size-5 rotate-180 transition-transform" />
                            <span class="text-sm">Logout</span>
                        </Button>
                        <Button
                            href="/apply"
                            onclick={() => {
                                if (!applicationEnabled) toast.error("Applications are closed");
                            }}
                            class="p-2"
                        >
                            <MaterialSymbolsLabProfileRounded class="size-5 transition-transform" />
                            <span class="text-sm">Apply</span>
                        </Button>
                    </div>
                    <Button href="/cwl" class="p-2">
                        <MdiSwordCross class="size-5 transition-transform" />
                        <span class="text-sm">Clan War League</span>
                    </Button>
                    {#if user.isAdmin}
                        <Button href="/admin" class="p-2">
                            <MaterialSymbolsAdminPanelSettingsRounded class="size-5 transition-transform" />
                            <span class="text-sm">Admin Panel</span>
                        </Button>
                    {/if}
                </div>
            </Popover.Content>
        </Popover.Portal>
    </Popover.Root>
{:else}
    <Button href="/auth/login" size="sm">Login</Button>
{/if}
