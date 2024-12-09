<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import AkarIconsThreeLineHorizontal from "~icons/akar-icons/three-line-horizontal";
    import AkarIconsCross from "~icons/akar-icons/cross";
    import { slide } from "svelte/transition";
    import InlineLink from "$lib/components/InlineLink.svelte";

    interface Item {
        name: string;
        href: string;
        newTab?: boolean;
    }

    let items: Item[] = [
        { name: "Home", href: "/" },
        { name: "Discord", href: "https://discord.clashwithjpa.com", newTab: true },
        { name: "Clans", href: "/clans" }
    ];

    let isOpen = $state(false);

    function toggleMenu() {
        isOpen = !isOpen;
    }
</script>

<div class="fixed top-0 z-20 {isOpen ? 'size-full' : 'w-full rounded-b-2xl'} flex flex-col items-center p-4 px-6 backdrop-blur-sm md:px-12 lg:px-28">
    <div class="flex w-full items-center justify-between">
        <div class="flex items-center justify-center space-x-1">
            <img src="/logo.webp" alt="Logo" class="size-12" />
            <a href="/" class="text-xl">JPA</a>
        </div>
        <div class="flex items-center md:hidden">
            <button onclick={toggleMenu} aria-label="Toggle menu" class="transition-all">
                {#if isOpen}
                    <AkarIconsCross class="size-6" />
                {:else}
                    <AkarIconsThreeLineHorizontal class="size-6" />
                {/if}
            </button>
        </div>
        <div class="hidden items-center justify-center gap-4 md:flex">
            {#each items as item}
                <InlineLink href={item.href} newTab={item.newTab}>
                    {item.name}
                </InlineLink>
            {/each}
            <Button href="/join" size="sm">Join Us</Button>
        </div>
    </div>
    {#if isOpen}
        <div transition:slide={{ axis: "y" }} class="size-full md:hidden">
            <div class="flex flex-col items-center justify-center gap-4 p-4">
                {#each items as item}
                    <InlineLink href={item.href} newTab={item.newTab} onclick={() => {toggleMenu();}}>
                        {item.name}
                    </InlineLink>
                {/each}
                <Button href="/join" size="md" onclick={() => {toggleMenu();}}>Join Us</Button>
            </div>
        </div>
    {/if}
</div>
