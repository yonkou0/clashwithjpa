<script lang="ts">
    import UserName from "$lib/components/Admin/UserName.svelte";
    import type { InsertCWL } from "$lib/server/schema";
    import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
    import type { GridOptions } from "@ag-grid-community/core";
    import { themeQuartz } from "@ag-grid-community/theming";
    import { AgGrid, makeSvelteCellRenderer } from "ag-grid-svelte5-extended";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();
    let applications = $derived(data.cwlApplications);

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
        checkboxBorderRadius: 6 // rounded-md
    });

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
            { field: "formattedDate", headerName: "Applied At" }
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
        theme
    };
</script>

<div class="flex size-full flex-col gap-5 p-5 md:p-11">
    <h1 class="text-3xl font-bold md:text-4xl">Clan War League</h1>
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
