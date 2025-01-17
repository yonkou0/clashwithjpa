<script lang="ts">
    import AdminSidebar from "$lib/components/AdminBar.svelte";
    import type { Snippet } from "svelte";

    interface Props {
        children?: Snippet;
    }

    let { children }: Props = $props();
</script>

<svelte:head>
    <title>JPA | Admin</title>
</svelte:head>

<main class="flex size-full flex-col-reverse md:flex-row">
    <AdminSidebar />
    <main class="size-full overflow-auto pb-20 pt-20 md:pl-52 md:pb-0">
        {@render children?.()}
    </main>
</main>
