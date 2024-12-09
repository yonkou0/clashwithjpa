<script lang="ts">
    import { page } from "$app/stores";
    import type { Component } from "svelte";

    interface Props {
        href: string;
        class?: string;
        icon?: Component;
        newTab?: boolean;
        children: import("svelte").Snippet;
    }
    let { href, icon = undefined, class: className = "", newTab = false, children }: Props = $props();

    function getClass(pathname: string, href: string): string {
        const baseClass =
            "relative text-sm after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-gray-100 after:transition-transform after:duration-300 after:ease-in-out";
        const activeClass = "after:origin-bottom-left after:scale-x-100 hover:after:origin-bottom-right hover:after:scale-x-0";
        const inactiveClass = "after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100";
        return `${baseClass} ${pathname === href ? activeClass : inactiveClass}`;
    }
</script>

<a {href} target={newTab ? "_blank" : "_parent"} class={getClass($page.url.pathname, href) + " " + className}>
    {@render children?.()}
    {#if icon}
        {@const SvelteComponent = icon}
        <SvelteComponent class="inline-block" />
    {/if}
</a>
