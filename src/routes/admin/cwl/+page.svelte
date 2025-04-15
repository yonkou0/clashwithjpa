<script lang="ts">
    import UserName from "$lib/components/Admin/UserName.svelte";
    import type { InsertCWL } from "$lib/server/schema";
    import { Grid, PlainTableCssTheme, type GridColumn, type PagingData } from "@mediakular/gridcraft";
// Deprecated, but still used in some places because of svelte 4 in @mediakular/gridcraft
    import Button from "$lib/components/Button.svelte";
    import type { ComponentType } from "svelte";
    import { fade } from "svelte/transition";
    import MaterialSymbolsArrowBackIosRounded from "~icons/material-symbols/arrow-back-ios-rounded";
    import MaterialSymbolsArrowForwardIosRounded from "~icons/material-symbols/arrow-forward-ios-rounded";
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
    function nextPage() {
        paging.currentPage += 1;
    }
    function prevPage() {
        paging.currentPage -= 1;
    }
    function handleItemsPerPageChange() {
        paging.itemsPerPage = paging.itemsPerPage;
    }
</script>

<div class="cwl-grid flex flex-col p-5 md:p-11" in:fade>
    <h1 class="text-3xl font-bold md:text-4xl">Clan War League</h1>
    <Grid bind:data={formattedApplications} bind:columns bind:selectedRows showCheckboxes={true} {paging} theme={PlainTableCssTheme} />
    <div class="flex w-full flex-col items-center justify-between gap-2 rounded-b-lg bg-gray-900 p-2 md:flex-row md:p-5">
        <div class="flex items-center justify-center gap-2">
            <select class="input/select cursor-pointer" bind:value={paging.itemsPerPage} onchange={handleItemsPerPageChange}>
                {#each paging.itemsPerPageOptions as option (option)}
                    <option class="bg-gray-900" value={option} selected={option == paging.itemsPerPage}>{option}</option>
                {/each}
            </select>

            <p>Page <span>{paging.currentPage}</span> of <span>{paging.totalPages}</span></p>
        </div>

        <div class="flex items-center justify-between gap-2 *:cursor-pointer">
            <Button class="flex items-center justify-center gap-2" size="md" onclick={prevPage} disabled={paging.currentPage == 1 ? true : false}>
                <MaterialSymbolsArrowBackIosRounded class="size-5" />
                <span>Previous</span>
            </Button>
            <Button
                class="flex items-center justify-center gap-2"
                size="md"
                onclick={nextPage}
                disabled={paging.currentPage < paging.totalPages ? false : true}
            >
                <span>Next</span>
                <MaterialSymbolsArrowForwardIosRounded class="size-5" />
            </Button>
        </div>
    </div>
</div>

<style>
    :global(:root) {
        --gc-main-color: var(--color-gray-900);
        --gc-secondary-color: var(--color-gray-900);
        --gc-tertiary-color: var(--color-gray-800);
        --gc-text-color: var(--color-gray-50);
        --gc-color-selected: var(--color-gray-800);
        --gc-table-radius: var(--radius-lg);
    }
</style>
