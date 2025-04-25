<script lang="ts">
    import type { InsertCoc } from "$lib/server/schema";
    import type { ICellRendererParams } from "@ag-grid-community/core";
    import CocAccounts from "../CocAccounts.svelte";

    let params: ICellRendererParams = $props();
</script>

<CocAccounts tags={params.value.map((coc: InsertCoc) => coc.tag)} />
