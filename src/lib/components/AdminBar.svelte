<script lang="ts">
    import { page } from "$app/state";
    import type { Component } from "svelte";
    import MaterialSymbolsAdminPanelSettingsRounded from "~icons/material-symbols/admin-panel-settings-rounded";
    import MaterialSymbolsBookRibbonOutlineRounded from "~icons/material-symbols/book-ribbon-outline-rounded";
    import MaterialSymbolsGroup from "~icons/material-symbols/group";
    import MaterialSymbolsLabProfileRounded from "~icons/material-symbols/lab-profile-rounded";
    import MaterialSymbolsSettingsRounded from "~icons/material-symbols/settings-rounded";

    interface Item {
        name: string;
        icon: Component;
        href: string;
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
            icon: MaterialSymbolsGroup,
            href: "/admin/clans"
        },
        {
            name: "Applications",
            icon: MaterialSymbolsLabProfileRounded,
            href: "/admin/applications"
        },
        {
            name: "Rules",
            icon: MaterialSymbolsBookRibbonOutlineRounded,
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
    class="fixed inset-x-0 bottom-0 z-20 mt-20 flex w-screen max-w-screen items-center justify-evenly gap-2 bg-gray-900 p-2 backdrop-blur-xs transition-all md:inset-y-0 md:left-0 md:max-h-screen md:w-fit md:max-w-lg md:flex-col md:justify-start md:rounded-t-none md:py-4"
    class:rounded-t-2xl={page.route.id !== "/admin/rules"}
    class:md:rounded-br-2xl={page.route.id !== "/admin/rules"}
>
    {#each items as item}
        <a
            href={item.href}
            class="flex w-full flex-col items-center justify-start rounded-xl p-2 transition-all duration-200 hover:bg-gray-950/50 md:flex-row md:gap-2 md:px-5"
            class:bg-gray-950={page.route.id === item.href}
            class:bg-opacity-50={page.route.id === item.href}
        >
            <item.icon class="size-6 md:size-8" />
            <span class="text-[8px] md:text-base">{item.name}</span>
        </a>
    {/each}
</nav>
