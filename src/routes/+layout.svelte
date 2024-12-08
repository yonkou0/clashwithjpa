<script lang="ts">
    import "../app.css";
    import { onNavigate } from "$app/navigation";
    import Navbar from "$lib/components/Navbar.svelte";

    interface Props {
        children?: import("svelte").Snippet;
    }

    let { children }: Props = $props();

    onNavigate((navigation) => {
        if (!document.startViewTransition) return;

        return new Promise((resolve) => {
            document.startViewTransition(async () => {
                resolve();
                await navigation.complete;
            });
        });
    });
</script>

<main class="h-screen w-screen">
    <Navbar />
    {@render children?.()}
</main>
