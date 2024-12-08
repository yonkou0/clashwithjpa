<script lang="ts">
    import { page } from "$app/stores";
    import Button from "$lib/components/Button.svelte";
    import AkarIconsThreeLineHorizontal from "~icons/akar-icons/three-line-horizontal";
    import AkarIconsCross from "~icons/akar-icons/cross";
    import { slide } from "svelte/transition";

    interface Item {
        name: string;
        href: string;
    }

    let items: Item[] = [
        { name: "Home", href: "/" },
        { name: "Discord", href: "/discord" },
        { name: "Clans", href: "/clans" }
    ];

    let isOpen = $state(false);

    function toggleMenu() {
        isOpen = !isOpen;
    }

    function getClass(pathname: string, href: string): string {
        const baseClass =
            "relative text-sm after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-gray-100 after:transition-transform after:duration-300 after:ease-in-out";
        const activeClass = "after:origin-bottom-left after:scale-x-100 hover:after:origin-bottom-right hover:after:scale-x-0";
        const inactiveClass = "after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100";
        return `${baseClass} ${pathname === href ? activeClass : inactiveClass}`;
    }
</script>

<div class="fixed top-0 z-20 {isOpen ? 'size-full' : 'w-full rounded-b-2xl'} flex flex-col items-center p-4 px-6 backdrop-blur-sm md:px-12 lg:px-28">
    <div class="flex w-full items-center justify-between">
        <div class="flex items-center justify-center space-x-1">
            <img src="/logo.webp" alt="Logo" class="size-12" />
            <h2 class="text-xl">JPA</h2>
        </div>
        <div class="flex items-center md:hidden">
            <button onclick={toggleMenu} aria-label="Toggle menu" class="transition-all">
                {#if isOpen}
                    <AkarIconsCross class="h-6 w-6" />
                {:else}
                    <AkarIconsThreeLineHorizontal class="h-6 w-6" />
                {/if}
            </button>
        </div>
        <div class="hidden items-center justify-center gap-4 md:flex">
            {#each items as item}
                <a href={item.href} class={getClass($page.url.pathname, item.href)}>{item.name}</a>
            {/each}
            <Button href="/join" size="sm">Join Us</Button>
        </div>
    </div>
    {#if isOpen}
        <div transition:slide={{ axis: "y" }} class="size-full md:hidden">
            <div class="flex flex-col items-center justify-center gap-4 p-4">
                {#each items as item}
                    <a href={item.href} class={getClass($page.url.pathname, item.href)}>{item.name}</a>
                {/each}
                <Button href="/join" size="md">Join Us</Button>
            </div>
        </div>
    {/if}
</div>
