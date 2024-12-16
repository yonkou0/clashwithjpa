<script lang="ts">
    import AkarIconsThreeLineHorizontal from "~icons/akar-icons/three-line-horizontal";
    import AkarIconsCross from "~icons/akar-icons/cross";
    import { slide } from "svelte/transition";
    import UserButton from "$lib/components/UserButton.svelte";
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

    let { user }: { user: any | null } = $props();

    let isOpen = $state(false);
    function toggleMenu() {
        isOpen = !isOpen;
    }
</script>

<div
    class="fixed top-0 z-20 flex max-h-screen w-full flex-col items-center p-4 px-6 backdrop-blur-sm transition-all md:px-12 lg:px-28"
    class:rounded-b-2xl={!isOpen}
    class:!backdrop-blur-md={isOpen}
>
    <div class="flex w-full items-center justify-between">
        <div class="flex items-center justify-center space-x-1">
            <img src="/logo.webp" alt="Logo" class="size-12" />
            <a href="/" class="text-xl">JPA</a>
        </div>
        <div class="flex items-center justify-center space-x-4 md:hidden">
            <UserButton {user} />
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
            <UserButton {user} />
        </div>
    </div>
    {#if isOpen}
        <div transition:slide class="size-full h-screen md:hidden">
            <div class="flex flex-col items-center justify-center gap-4 p-4">
                {#each items as item}
                    <InlineLink
                        href={item.href}
                        newTab={item.newTab}
                        onclick={() => {
                            toggleMenu();
                        }}
                    >
                        {item.name}
                    </InlineLink>
                {/each}
            </div>
        </div>
    {/if}
</div>
