<script lang="ts">
    import CWLApplications from "$lib/components/Admin/CWLApplications.svelte";
    import { fade } from "svelte/transition";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();
</script>

<div class="p-5 md:p-11" in:fade>
    <h1 class="text-3xl font-bold md:text-4xl">Clan War League</h1>
    <CWLApplications applications={data.cwlApplications} />
</div>
