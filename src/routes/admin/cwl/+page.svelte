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
    import MaterialSymbolsCloudDoneRounded from "~icons/material-symbols/cloud-done-rounded";
    import MaterialSymbolsCloudSyncRounded from "~icons/material-symbols/cloud-sync-rounded";
    import MaterialSymbolsDeleteRounded from "~icons/material-symbols/delete-rounded";
    import TablerLoader2 from "~icons/tabler/loader-2";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();
    let rowData = $derived<InsertCWL[]>(data.cwlApplications);
    let disabled: boolean = $state(false);
    let loading: boolean = $state(false);
    let syncing: boolean = $state(false);

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

    const gridOptions: GridOptions<InsertCWL> = {
        columnDefs: [
            {
                field: "userName",
                cellRenderer: makeSvelteCellRenderer(UserName),
                filter: true
            },
            {
                field: "preferenceNum",
                headerName: "P.N",
                headerTooltip: "Preference Number",
                filter: "agNumberColumnFilter",
                editable: true
            },
            { field: "accountName", filter: true },
            { field: "accountTag", filter: true },
            { field: "accountClan", filter: true, editable: true },
            { field: "accountWeight", filter: "agNumberColumnFilter", editable: true },
            {
                field: "appliedAt",
                valueFormatter: (params) => {
                    return new Date(params.data?.appliedAt || "").toLocaleString("en-IN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit"
                    });
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
            selectedRows = event.api.getSelectedRows();
        },
        onRowDataUpdated() {
            selectedRows = [];
        },
        async onCellValueChanged(event) {
            const updatedRow = event.data;
            syncing = true;
            let response = await fetch(`/admin/api/cwl`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    key: "update_application",
                    value: updatedRow
                })
            });
            if (response.ok) {
                invalidateAll();
            } else {
                toast.error("Failed to update application");
            }
            syncing = false;
        },
        theme
    };

    let selectedRows: InsertCWL[] = $state([]);

    async function removeApp(tags: string[]) {
        disabled = true;
        loading = true;
        let response = await fetch(`/admin/api/cwl`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                key: "delete_application",
                value: tags
            })
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
        <div class="flex items-center justify-center gap-2">
            <h1 class="text-3xl font-bold md:text-4xl">CWL</h1>
            <div class="size-8">
                {#if syncing}
                    <span in:fade class="size-full">
                        <MaterialSymbolsCloudSyncRounded class="size-full text-yellow-500" />
                    </span>
                {:else}
                    <span in:fade class="size-full">
                        <MaterialSymbolsCloudDoneRounded class="size-full text-green-500" />
                    </span>
                {/if}
            </div>
        </div>
        <div class="flex items-center justify-center gap-2">
            <Button
                size="sm"
                class="flex items-center justify-center gap-2 hover:not-disabled:!bg-red-500/10 hover:not-disabled:!text-red-500"
                disabled={selectedRows.length <= 0 || disabled}
                onclick={async () => {
                    await removeApp(selectedRows.map((row) => row.accountTag));
                }}
            >
                <div in:fade class="size-6">
                    {#if loading}
                        <span class="size-full">
                            <TablerLoader2 class="size-full animate-spin" />
                        </span>
                    {:else}
                        <span class="size-full">
                            <MaterialSymbolsDeleteRounded class="size-full" />
                        </span>
                    {/if}
                </div>
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
