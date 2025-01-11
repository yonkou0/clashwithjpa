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
    <main class="size-full p-5 pb-28 md:pl-52 pt-28">
        {@render children?.()}
    </main>
</main>
