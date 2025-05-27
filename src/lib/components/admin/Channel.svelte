<script lang="ts">
    import type { APIGuildTextChannel, GuildTextChannelType } from "discord-api-types/v10";

    interface Props {
        channelID: string;
    }

    let { channelID }: Props = $props();

    async function fetchChannelInfo(id: string): Promise<APIGuildTextChannel<GuildTextChannelType>> {
        const resp = await fetch(`/api/channel?id=${id}`);
        if (resp.ok) {
            const channelInfo = await resp.json();
            return channelInfo;
        } else {
            throw new Error("Failed to fetch channel info");
        }
    }
</script>

<span class="flex w-full shrink-0 items-center justify-start gap-1 text-sm">
    <div
        class="bg-blurple/50 text-blurple-light hover:bg-blurple hover:text-foreground flex shrink-0 items-center justify-start gap-1 rounded-md p-0.5 font-sans transition-colors"
    >
        {#await fetchChannelInfo(channelID)}
            <div class="bg-blurple h-5 w-20 shrink-0 animate-pulse rounded-md"></div>
        {:then channelInfo}
            <a href="https://discord.com/channels/{channelInfo.guild_id}/{channelID}" target="_blank" rel="noopener noreferrer" class="size-full">
                <p>#{channelInfo.name}</p>
            </a>
        {:catch}
            <p>#{channelID}</p>
        {/await}
    </div>
</span>
