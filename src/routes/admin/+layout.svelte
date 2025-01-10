<script lang="ts">
    import AdminSidebar from "$lib/components/AdminBar.svelte";
    import type { Snippet } from "svelte";

    interface Props {
        children?: Snippet;
    }

    let { children }: Props = $props();
</script>

<main class="flex-col-reverse md:flex-row flex size-full">
    <AdminSidebar />
    <main class="p-5 pt-28 size-full">
        {@render children?.()}
    </main>
</main>
