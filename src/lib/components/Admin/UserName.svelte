<script lang="ts">
    import type { APIUser } from "discord-api-types/v10";

    interface Props {
        userName: string;
        userID: string;
    }
    let { userName, userID }: Props = $props();

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
        href="https://discord.com/users/{userID}"
        target="_blank"
        rel="noopener noreferrer"
        class="bg-blurple/50 text-blurple-light shrink-0 hover:bg-blurple flex cursor-pointer items-center justify-start gap-1 rounded-md p-0.5 font-sans transition-colors hover:text-gray-50"
    >
        {#await fetchUserInfo(userID)}
            <div class="bg-blurple size-6 animate-pulse rounded-full"></div>
        {:then userInfo}
            <div class="relative flex size-6 w-full items-center justify-center">
                <img
                    src={`https://cdn.discordapp.com/avatars/${userID}/${userInfo.avatar}?size=4096`}
                    alt="User Avatar"
                    class="size-full rounded-full bg-gray-950"
                />
                {#if userInfo.avatar_decoration_data?.asset}
                    <img
                        src={`https://cdn.discordapp.com/avatar-decoration-presets/${userInfo.avatar_decoration_data?.asset}`}
                        alt="Avatar Decoration"
                        class="absolute z-10 size-full rounded-full"
                    />
                {/if}
            </div>
        {/await}
        @{userName}
    </a>
</span>
