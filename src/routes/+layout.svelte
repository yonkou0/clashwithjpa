<script lang="ts">
    import "../app.css";
    import "../nprogress.css";
    import { onNavigate, afterNavigate, beforeNavigate } from "$app/navigation";
    import Navbar from "$lib/components/Navbar.svelte";
    import NProgress from "nprogress";

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

    beforeNavigate(() => {
        NProgress.start();
    });
    afterNavigate(() => {
        NProgress.done();
    });
    NProgress.configure({ showSpinner: false });
</script>

<main class="h-screen w-screen">
    <Navbar />
    {@render children?.()}
</main>
