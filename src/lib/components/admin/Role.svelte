<script lang="ts">
    import type { APIRole } from "discord-api-types/v10";

    interface Props {
        roleID: string;
    }

    let { roleID }: Props = $props();

    async function fetchRoleInfo(id: string): Promise<APIRole> {
        const resp = await fetch(`/api/role?id=${id}`);
        if (resp.ok) {
            const roleInfo = await resp.json();
            return roleInfo;
        } else {
            throw new Error("Failed to fetch channel info");
        }
    }
</script>

<span class="flex w-full shrink-0 items-center justify-start gap-1 text-sm">
    <div
        class="bg-blurple/50 text-blurple-light hover:bg-blurple hover:text-foreground flex shrink-0 items-center justify-start gap-1 rounded-md p-0.5 font-sans transition-colors"
    >
        {#await fetchRoleInfo(roleID)}
            <div class="bg-blurple h-5 w-20 shrink-0 animate-pulse rounded-md"></div>
        {:then roleInfo}
            <p>@{roleInfo.name}</p>
        {:catch}
            <p>@{roleID}</p>
        {/await}
    </div>
</span>
