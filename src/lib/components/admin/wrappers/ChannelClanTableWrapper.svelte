<script lang="ts">
    import type { ICellRendererParams } from "@ag-grid-community/core";
    import Channel from "../Channel.svelte";

    let params: ICellRendererParams = $props();
</script>

<Channel channelID={params.value} />
