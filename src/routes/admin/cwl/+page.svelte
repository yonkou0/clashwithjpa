<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import NewCwlPopup from "$lib/components/Admin/NewCWLPopup.svelte";
    import UserName from "$lib/components/Admin/UserName.svelte";
    import Button from "$lib/components/Button.svelte";
    import { toast } from "$lib/components/toast";
    import type { InsertCWL } from "$lib/server/schema";
    import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
    import type { GridOptions, IDateFilterParams } from "@ag-grid-community/core";
    import { themeQuartz } from "@ag-grid-community/theming";
    import { AgGrid, makeSvelteCellRenderer } from "ag-grid-svelte5-extended";
    import { json2csv } from "json-2-csv";
    import { fade } from "svelte/transition";
    import MaterialSymbolsAdd2Rounded from "~icons/material-symbols/add-2-rounded";
    import MaterialSymbolsCloudAlertRounded from "~icons/material-symbols/cloud-alert-rounded";
    import MaterialSymbolsCloudDoneRounded from "~icons/material-symbols/cloud-done-rounded";
    import MaterialSymbolsCloudSyncRounded from "~icons/material-symbols/cloud-sync-rounded";
    import MaterialSymbolsDeleteRounded from "~icons/material-symbols/delete-rounded";
    import MaterialSymbolsDocumentScanner from "~icons/material-symbols/document-scanner";
    import TablerLoader2 from "~icons/tabler/loader-2";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();
    let rowData = $derived<InsertCWL[]>(data.cwlApplications);
    let disabled: boolean = $state(false);
    let loading: boolean = $state(false);
    let syncing: "success" | "loading" | "error" = $state("success");
    let openPopup: boolean = $state(false);

    const theme = themeQuartz.withParams({
        backgroundColor: "#030712", // gray-900
        browserColorScheme: "dark",
        chromeBackgroundColor: {
            ref: "foregroundColor",
            mix: 0.07,
            onto: "backgroundColor"
        },
        foregroundColor: "#F9FAFB", // gray-50
        headerFontSize: 14,
        borderRadius: 8, // rounded-lg
        checkboxBorderRadius: 6, // rounded-md
        focusShadow: "",
        dropdownShadow: {
            radius: 8,
            color: "#1F2937" // gray-800
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
            {
                field: "accountClan",
                filter: true,
                editable: true,
                cellEditor: "agSelectCellEditor",
                cellEditorParams: {
                    values: data.clans.map((clan) => clan.clanData?.name)
                }
            },
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
        async onCellValueChanged(event) {
            const updatedRow = event.data;
            syncing = "loading";
            let response = await fetch(`/admin/api/cwl`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    key: "update_application",
                    value: updatedRow
                })
            });
            if (response.ok) {
                syncing = "success";
                invalidateAll();
            } else {
                syncing = "error";
                toast.error("Failed to update application");
            }
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
        selectedRows = [];
        loading = false;
        setTimeout(() => {
            disabled = false;
        }, 500);
    }

    // TODO: New CWL Form
</script>

<NewCwlPopup bind:open={openPopup}>
    <form></form>
</NewCwlPopup>

<div class="flex size-full flex-col gap-5 p-5 md:p-11">
    <div class="flex w-full items-center justify-between">
        <div class="flex items-center justify-center gap-2">
            <h1 class="text-3xl font-bold md:text-4xl">CWL</h1>
            <div class="size-8">
                {#if syncing === "success"}
                    <span in:fade class="size-full">
                        <MaterialSymbolsCloudDoneRounded class="size-full text-green-500" />
                    </span>
                {:else if syncing === "loading"}
                    <span in:fade class="size-full">
                        <MaterialSymbolsCloudSyncRounded class="size-full text-yellow-500" />
                    </span>
                {:else if syncing === "error"}
                    <span in:fade class="size-full">
                        <MaterialSymbolsCloudAlertRounded class="size-full text-red-500" />
                    </span>
                {/if}
            </div>
        </div>
        <div class="flex items-center justify-center gap-2">
            <Button
                size="sm"
                class="flex items-center justify-center gap-2"
                disabled={rowData.length <= 0 || disabled}
                onclick={() => {
                    const csvRow = rowData.map((row) => ({
                        "User Name": row.userName,
                        "Preference Number": row.preferenceNum,
                        "Account Name": row.accountName,
                        "Account Tag": row.accountTag,
                        "Account Clan": row.accountClan,
                        "Account Weight": row.accountWeight,
                        "Applied At": new Date(row.appliedAt || "").toLocaleString("en-IN", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit"
                        })
                    }));
                    const csv = json2csv(csvRow);
                    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "cwl.csv";
                    a.click();
                    URL.revokeObjectURL(url);
                }}
            >
                <div class="size-6">
                    <MaterialSymbolsDocumentScanner class="size-full" />
                </div>
            </Button>
            <Button size="sm" class="flex items-center justify-center gap-2" {disabled} onclick={() => (openPopup = true)}>
                <div class="size-6">
                    <MaterialSymbolsAdd2Rounded class="size-full" />
                </div>
            </Button>
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
