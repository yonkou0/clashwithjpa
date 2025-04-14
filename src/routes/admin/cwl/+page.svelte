<script lang="ts">
    import { Grid, GridFooter, type GridColumn, type PagingData } from "@mediakular/gridcraft";
    import { fade } from "svelte/transition";
    import type { PageData } from "./$types";

    interface CWLApplicationsType {
        id: number;
        userId: string;
        userName: string;
        accountName: string;
        accountTag: string;
        accountClan: string;
        accountWeight: number;
        month: string;
        year: number;
        preferenceNum: number;
        appliedAt: Date;
    }

    let { data }: { data: PageData } = $props();
    let applications = $derived(data.cwlApplications);
    let columns: GridColumn<CWLApplicationsType>[] = $state([
        {
            key: "userName",
            title: "User Name",
            visible: true,
            sortable: true
        },
        {
            key: "accountName",
            title: "Account Name",
            visible: true,
            sortable: true
        },
        {
            key: "accountTag",
            title: "Account Tag",
            visible: true,
            sortable: true
        },
        {
            key: "accountClan",
            title: "Account Clan",
            visible: true,
            sortable: true
        },
        {
            key: "accountWeight",
            title: "Account Weight",
            visible: true,
            sortable: true
        },
        {
            key: "appliedAt",
            title: "Applied At",
            visible: true,
            sortable: true
        }
    ]);

    let selectedRows: CWLApplicationsType[] = $state.raw([]);

    let paging = $state({
        itemsPerPage: 10,
        currentPage: 1,
        itemsPerPageOptions: [5, 10, 20, 50]
    }) as PagingData;
</script>

<div class="flex flex-col gap-4 p-5 md:p-11" in:fade>
    <h1 class="text-3xl font-bold md:text-4xl">Clan War League</h1>
    <Grid bind:data={applications} bind:columns bind:selectedRows showCheckboxes={true} {paging} />
    <GridFooter bind:paging />
</div>
