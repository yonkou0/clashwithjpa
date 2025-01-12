<script lang="ts">
    import AdminSidebar from "$lib/components/AdminBar.svelte";
    import type { Snippet } from "svelte";

    interface Props {
        children?: Snippet;
    }

    let { children }: Props = $props();
</script>

<main class="flex size-full flex-col-reverse md:flex-row">
    <AdminSidebar />
    <main class="mt-24 flex w-full flex-col overflow-auto">
        {@render children?.()}
    </main>
</main>
