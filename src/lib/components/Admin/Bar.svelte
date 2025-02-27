<script lang="ts">
    import { page } from "$app/state";
    import { Popover } from "bits-ui";
    import type { Component } from "svelte";
    import MaterialSymbolsAdminPanelSettingsRounded from "~icons/material-symbols/admin-panel-settings-rounded";
    import MaterialSymbolsBook4SparkRounded from "~icons/material-symbols/book-4-spark-rounded";
    import MaterialSymbolsGroupsRounded from "~icons/material-symbols/groups-rounded";
    import MaterialSymbolsMoreVert from "~icons/material-symbols/more-vert";
    import MaterialSymbolsSettingsRounded from "~icons/material-symbols/settings-rounded";
    import MaterialSymbolsSheets from "~icons/material-symbols/sheets";
    import MaterialSymbolsSwordsOutlineRounded from "~icons/material-symbols/swords-outline-rounded";

    interface Item {
        name: string;
        icon: Component;
        href: string;
        hidden?: boolean;
        newTab?: boolean;
    }
    const items: Item[] = [
        {
            name: "Overview",
            icon: MaterialSymbolsAdminPanelSettingsRounded,
            href: "/admin"
        },
        {
            name: "Clans",
            icon: MaterialSymbolsGroupsRounded,
            href: "/admin/clans"
        },
        {
            name: "Applications",
            icon: MaterialSymbolsSheets,
            href: "/admin/applications",
            hidden: true
        },
        {
            name: "CWL",
            icon: MaterialSymbolsSwordsOutlineRounded,
            href: "/admin/cwl",
            hidden: true
        },
        {
            name: "Rules",
            icon: MaterialSymbolsBook4SparkRounded,
            href: "/admin/rules"
        },
        {
            name: "Settings",
            icon: MaterialSymbolsSettingsRounded,
            href: "/admin/settings"
        }
    ];
</script>

<nav
    class="fixed inset-x-0 bottom-0 z-100 mt-20 flex w-screen max-w-screen items-center justify-evenly gap-2 bg-gray-900 p-2 backdrop-blur-xs transition-all md:inset-y-0 md:left-0 md:max-h-screen md:w-fit md:max-w-lg md:flex-col md:justify-start md:rounded-t-none md:py-4"
    class:rounded-t-2xl={page.route.id !== "/admin/rules"}
    class:md:rounded-br-2xl={page.route.id !== "/admin/rules"}
>
    {#each items as item}
        <a
            href={item.href}
            class="{page.route.id === item.href
                ? 'bg-gray-950/50'
                : ''} flex w-full flex-col items-center justify-start rounded-xl p-2 transition-all duration-200 hover:bg-gray-950/50 md:flex-row md:gap-2 md:px-5"
            class:hidden={item.hidden}
            class:md:flex={item.hidden}
        >
            <item.icon class="size-6 md:size-8" />
            <span class="text-[8px] md:text-base">{item.name}</span>
        </a>
    {/each}
    <Popover.Root>
        <Popover.Trigger class="w-full md:hidden">
            <button
                class="flex w-full cursor-pointer flex-col items-center justify-start rounded-xl p-2 transition-all duration-200 hover:bg-gray-950/50 md:flex-row md:gap-2 md:px-5"
            >
                <MaterialSymbolsMoreVert class="size-6 md:size-8" />
                <span class="text-[8px] md:text-base">More</span>
            </button>
        </Popover.Trigger>
        <Popover.Content class="z-20 mx-1 flex w-40 items-center justify-evenly gap-2 rounded-xl border border-gray-700 bg-gray-900 p-2 shadow-lg">
            {#each items as item}
                {#if item.hidden}
                    <a
                        href={item.href}
                        class="{page.route.id === item.href
                            ? 'bg-gray-950/50'
                            : ''} flex w-full flex-col items-center justify-start rounded-xl p-2 transition-all duration-200 hover:bg-gray-950/50 md:flex-row md:gap-2 md:px-5"
                    >
                        <item.icon class="size-6 md:size-8" />
                        <span class="text-[8px] md:text-base">{item.name}</span>
                    </a>
                {/if}
            {/each}
        </Popover.Content>
    </Popover.Root>
</nav>
