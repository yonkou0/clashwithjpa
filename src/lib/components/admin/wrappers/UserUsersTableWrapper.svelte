<script lang="ts">
    import type { ICellRendererParams } from "@ag-grid-community/core";
    import User from "../User.svelte";

    let params: ICellRendererParams = $props();
</script>

<User userID={params.data.discordId} />
