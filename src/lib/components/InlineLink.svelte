<script lang="ts">
    import { page } from "$app/state";
    import { cn } from "$lib/components/utils/cn";
    import { Button } from "bits-ui";
    import PhArrowUpRightBold from "~icons/ph/arrow-up-right-bold";

    interface Props {
        href?: string | null;
        class?: string;
        arrow?: boolean;
        newTab?: boolean;
        onclick?: () => void;
        children: import("svelte").Snippet;
    }
    let { href = null, class: className = "", arrow = false, newTab = false, onclick = () => {}, children }: Props = $props();

    function getClass(pathname: string, href: string | null): string {
        const baseClass =
            "relative text-base after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-gray-100 after:transition-transform after:duration-300 after:ease-in-out";
        const activeClass = "after:origin-bottom-left after:scale-x-100 hover:after:origin-bottom-right hover:after:scale-x-0";
        const inactiveClass = "after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100";
        return `${baseClass} ${pathname === (href || "") ? activeClass : inactiveClass}`;
    }
</script>

<Button.Root
    {href}
    target={newTab ? "_blank" : ""}
    class={cn(getClass(page.url.pathname, href), className, "group flex items-center space-x-1 text-sm transition-all duration-300 ease-in-out")}
    {onclick}
    data-sveltekit-preload-data
>
    {@render children?.()}
    {#if arrow}
        <PhArrowUpRightBold class="size-fit transition-transform group-hover:-translate-y-1 group-hover:translate-x-2" />
    {/if}
</Button.Root>
