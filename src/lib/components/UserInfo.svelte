<script lang="ts">
    import type { APIUser } from "discord-api-types/v10";
    import InlineLink from "./InlineLink.svelte";

    interface Props {
        userID: string;
    }
    let { userID }: Props = $props();

    async function fetchUserInfo(id: string): Promise<APIUser> {
        const resp = await fetch(`/admin/api/user?id=${id}`);
        if (resp.ok) {
            const userInfo = await resp.json();
            console.log(userInfo);
            return userInfo;
        } else {
            throw new Error("Failed to fetch user info");
        }
    }
</script>

<div class="flex rounded-xl border border-gray-700 bg-gray-950">
    {#await fetchUserInfo(userID)}
        <div>Loading...</div>
    {:then userInfo}
        <div class="flex w-96 flex-col items-center justify-center">
            <div class="w-full">
                {#if userInfo.banner}
                    <img
                        src={`https://cdn.discordapp.com/banners/${userID}/${userInfo.banner}?size=4096`}
                        alt="User Banner"
                        class="h-28 w-full rounded-t-xl object-cover"
                    />
                {:else}
                    <div class="h-28 w-full rounded-t-xl" style="background-color: #{userInfo.accent_color || '1F2937'};"></div>
                {/if}
            </div>
            <div class="flex size-full flex-col items-start justify-center gap-2 p-4">
                <div class="-mt-15 -ml-2 flex w-full items-end justify-start">
                    <img
                        src={`https://cdn.discordapp.com/avatars/${userID}/${userInfo.avatar}?size=4096`}
                        alt="User Avatar"
                        class="size-28 rounded-full border-8 border-gray-950"
                    />
                    {#if userInfo.avatar_decoration_data?.asset}
                        <img
                            src={`https://cdn.discordapp.com/avatar-decoration-presets/${userInfo.avatar_decoration_data?.asset}`}
                            alt="Avatar Decoration"
                            class="absolute z-10 size-28 rounded-full"
                        />
                    {/if}
                </div>
                <div class="flex flex-col items-start justify-center gap-0.5">
                    <p class="text-xl font-bold">{userInfo.global_name || userInfo.username}</p>
                    <p class="font-mono text-sm text-gray-400">{userInfo.id}</p>
                </div>
                <InlineLink href="https://discord.com/users/{userID}" newTab={true} arrow={true}>Open In Discord</InlineLink>
            </div>
        </div>
    {:catch error}
        <div class="flex w-full items-center justify-center gap-1">
            <p class="text-red-400">{error.message}</p>
        </div>
    {/await}
</div>
