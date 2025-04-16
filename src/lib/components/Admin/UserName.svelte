<script lang="ts">
    import type { ICellRendererParams } from "@ag-grid-community/core";
    import type { APIUser } from "discord-api-types/v10";
    import { fade } from "svelte/transition";

    let params: ICellRendererParams = $props();

    async function fetchUserInfo(id: string): Promise<APIUser> {
        const resp = await fetch(`/admin/api/user?id=${id}`);
        if (resp.ok) {
            const userInfo = await resp.json();
            return userInfo;
        } else {
            throw new Error("Failed to fetch user info");
        }
    }
</script>

<span class="flex w-full items-center justify-start gap-1 text-sm">
    <a
        href="https://discord.com/users/{params.data.userId}"
        target="_blank"
        rel="noopener noreferrer"
        class="bg-blurple/50 text-blurple-light hover:bg-blurple flex shrink-0 cursor-pointer items-center justify-start gap-1 rounded-md p-0.5 font-sans transition-colors hover:text-gray-50"
    >
        {#await fetchUserInfo(params.data.userId)}
            <div class="bg-blurple size-6 animate-pulse rounded-full"></div>
        {:then userInfo}
            <div in:fade class="relative flex size-6 w-full items-center justify-center">
                <div
                    class="bg-blurple size-6 rounded-full bg-cover bg-center"
                    style="background-image: url('https://cdn.discordapp.com/avatars/{params.data.userId}/{userInfo.avatar}?size=4096');"
                ></div>
                {#if userInfo.avatar_decoration_data?.asset}
                    <img
                        src={`https://cdn.discordapp.com/avatar-decoration-presets/${userInfo.avatar_decoration_data?.asset}`}
                        alt="Avatar Decoration"
                        class="absolute z-10 size-full rounded-full"
                    />
                {/if}
            </div>
        {/await}
        @{params.data.userName}
    </a>
</span>
