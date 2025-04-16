<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import UserName from "$lib/components/Admin/UserName.svelte";
    import Button from "$lib/components/Button.svelte";
    import { toast } from "$lib/components/toast";
    import type { InsertCWL } from "$lib/server/schema";
    import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
    import type { GridOptions, IDateFilterParams } from "@ag-grid-community/core";
    import { themeQuartz } from "@ag-grid-community/theming";
    import { AgGrid, makeSvelteCellRenderer } from "ag-grid-svelte5-extended";
    import { fade } from "svelte/transition";
    import MaterialSymbolsDeleteRounded from "~icons/material-symbols/delete-rounded";
    import TablerLoader2 from "~icons/tabler/loader-2";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();
    let applications = $derived(data.cwlApplications);
    let disabled: boolean = $state(false);
    let loading: boolean = $state(false);

    type CWLApplication = InsertCWL & { formattedDate: string };

    let rowData = $derived<CWLApplication[]>(
        applications.map((application) => {
            return {
                ...application,
                formattedDate: new Date(application.appliedAt).toLocaleString("en-IN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit"
                })
            };
        })
    );

    const theme = themeQuartz.withParams({
        backgroundColor: "#030712", // slate-900
        browserColorScheme: "dark",
        chromeBackgroundColor: {
            ref: "foregroundColor",
            mix: 0.07,
            onto: "backgroundColor"
        },
        foregroundColor: "#F9FAFB", // slate-50
        headerFontSize: 14,
        borderRadius: 8, // rounded-lg
        checkboxBorderRadius: 6, // rounded-md
        focusShadow: "",
        dropdownShadow: {
            radius: 8,
            color: "#1F2937" // slate-800
        }
    });

    const filterParams: IDateFilterParams = {
        comparator: (filterDate: Date, cellValue: string) => {
            const cellDate = new Date(cellValue).getDate();
            if (cellDate < filterDate.getDate()) {
                return -1;
            } else if (cellDate > filterDate.getDate()) {
                return 1;
            }
            return 0;
        }
    };

    const gridOptions: GridOptions<CWLApplication> = {
        columnDefs: [
            {
                field: "userName",
                cellRenderer: makeSvelteCellRenderer(UserName),
                filter: true
            },
            { field: "accountName", filter: true },
            { field: "accountTag", filter: true },
            { field: "accountClan", filter: true },
            { field: "accountWeight", filter: "agNumberColumnFilter" },
            {
                field: "appliedAt",
                valueFormatter: (params) => {
                    return params.data?.formattedDate || "";
                },
                headerName: "Applied At",
                filter: "agDateColumnFilter",
                filterParams
            }
        ],
        autoSizeStrategy: {
            type: "fitCellContents",
            skipHeader: false
        },
        pagination: true,
        paginationAutoPageSize: true,
        rowSelection: {
            mode: "multiRow"
        },
        onRowSelected(event) {
            const rows = event.api.getSelectedRows();
            const count = rows.length;
            const totalCount = event.api.getDisplayedRowCount();
            selectedRows = rows;
        },
        onRowDataUpdated() {
            selectedRows = [];
        },
        theme
    };

    let selectedRows: CWLApplication[] = $state([]);

    async function removeApp(tags: string[]) {
        disabled = true;
        loading = true;
        let response = await fetch(`/admin/api/cwl/${encodeURIComponent(tags.toString())}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
        });
        if (response.ok) {
            invalidateAll();
        } else {
            toast.error("Failed to remove application");
        }
        loading = false;
        setTimeout(() => {
            disabled = false;
        }, 500);
    }
</script>

<div class="flex size-full flex-col gap-5 p-5 md:p-11">
    <div class="flex w-full items-center justify-between">
        <h1 class="text-3xl font-bold md:text-4xl">Clan War League</h1>
        <div class="flex items-center justify-center gap-2">
            <Button
                size="sm"
                class="flex items-center justify-center gap-2 hover:not-disabled:!bg-red-500/10 hover:not-disabled:!text-red-500"
                disabled={selectedRows.length <= 0 || disabled}
                onclick={async () => {
                    await removeApp(selectedRows.map((row) => row.accountTag));
                }}
            >
                {#if loading}
                    <div in:fade class="size-6 animate-spin">
                        <TablerLoader2 class="size-full" />
                    </div>
                {:else}
                    <div in:fade class="size-6">
                        <MaterialSymbolsDeleteRounded class="size-full" />
                    </div>
                {/if}
                <span>Delete</span>
            </Button>
        </div>
    </div>
    <div class="size-full">
        <AgGrid {gridOptions} {rowData} modules={[ClientSideRowModelModule]} />
    </div>
</div>

<style>
    :global(.ag-cell) {
        display: flex;
        align-items: center;
    }
</style>
