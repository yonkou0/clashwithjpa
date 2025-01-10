<script lang="ts">
    import type { Component } from "svelte";
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
            name: "Clans",
            icon: MaterialSymbolsGroup,
            href: "/admin/clans"
        },
        {
            name: "Forms",
            icon: MaterialSymbolsLabProfileRounded,
            href: "/admin/forms"
        },
        {
            name: "Rules",
            icon: MaterialSymbolsBookRibbonOutlineRounded,
            href: "/admin/rules"
        },
        {
            name: "Settings",
            icon: MaterialSymbolsSettingsRounded,
            href: "/admin/rules"
        }
    ];
</script>

<nav
    class="max-w-screen sticky inset-x-0 bottom-0 z-20 flex items-center justify-evenly gap-2 rounded-t-xl bg-gray-900 p-2 md:py-4 backdrop-blur-sm transition-all md:inset-y-0 md:left-0 md:mt-[80px] md:max-h-screen md:max-w-lg md:flex-col md:justify-start md:rounded-t-none md:rounded-br-xl"
>
    {#each items as item}
        <a
            href={item.href}
            class="flex w-full flex-col items-center justify-start rounded-xl px-5 py-2 transition-all duration-200 hover:bg-gray-950/50 md:flex-row md:gap-2"
        >
            <item.icon class="size-6 md:size-8" />
            <span class="text-[8px] md:text-base">{item.name}</span>
        </a>
    {/each}
</nav>
