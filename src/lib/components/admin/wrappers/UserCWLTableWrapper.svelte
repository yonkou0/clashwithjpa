<script lang="ts">
    import type { ICellRendererParams } from "@ag-grid-community/core";
    import User from "../User.svelte";

    let params: ICellRendererParams = $props();
</script>

<User userName={params.data.userName} userID={params.data.userId} />
