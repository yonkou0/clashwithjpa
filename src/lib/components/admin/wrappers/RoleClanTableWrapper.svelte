<script lang="ts">
    import type { ICellRendererParams } from "@ag-grid-community/core";
    import Role from "../Role.svelte";

    let params: ICellRendererParams = $props();
</script>

<Role roleID={params.value} />
