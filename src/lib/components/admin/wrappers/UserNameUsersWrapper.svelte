<script lang="ts">
    import type { ICellRendererParams } from "@ag-grid-community/core";
    import UserName from "../UserName.svelte";

    let params: ICellRendererParams = $props();
</script>

<UserName userID={params.data.discordId} />
