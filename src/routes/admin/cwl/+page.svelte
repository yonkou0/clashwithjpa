<script lang="ts">
    import UserName from "$lib/components/Admin/UserName.svelte";
    import type { InsertCWL } from "$lib/server/schema";
    import { Grid, GridFooter, PlainTableCssTheme, type GridColumn, type PagingData } from "@mediakular/gridcraft";
    import type { ComponentType } from "svelte"; // Deprecated, but still used in some places because of svelte 4 in @mediakular/gridcraft
    import { fade } from "svelte/transition";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();
    let applications = $derived(data.cwlApplications);

    type CWLApplication = InsertCWL & { formattedDate: string };

    let formattedApplications: CWLApplication[] = $derived.by(() => {
        return applications.map((application) => {
            return {
                ...application,
                formattedDate: new Date(application.appliedAt).toLocaleString("en-IN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit"
                })
            };
        });
    });
    let columns: GridColumn<CWLApplication>[] = $state([
        {
            key: "userName",
            title: "User Name",
            visible: true,
            sortable: true,
            accessor: (row: CWLApplication) => {
                return {
                    userName: row.userName,
                    userID: row.userId
                };
            },
            renderComponent: UserName as unknown as ComponentType
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
            key: "formattedDate",
            title: "Applied At",
            visible: true,
            sortable: true
        }
    ]);

    let selectedRows: CWLApplication[] = $state.raw([]);

    let paging = $state({
        itemsPerPage: 10,
        currentPage: 1,
        itemsPerPageOptions: [5, 10, 20, 50]
    }) as PagingData;
</script>

<div class="flex flex-col gap-4 p-5 md:p-11" in:fade>
    <h1 class="text-3xl font-bold md:text-4xl">Clan War League</h1>
    <Grid bind:data={formattedApplications} bind:columns bind:selectedRows showCheckboxes={true} {paging} theme={PlainTableCssTheme} />
    <GridFooter bind:paging theme={PlainTableCssTheme} />
</div>

<style>
    :global(:root) {
        --gc-main-color: var(--color-slate-900);
        --gc-secondary-color: var(--color-slate-900);
        --gc-tertiary-color: var(--color-slate-800);
        --gc-text-color: var(--color-slate-50);
        --gc-color-selected: var(--color-slate-800);
    }
</style>
