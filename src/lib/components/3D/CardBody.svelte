<script lang="ts">
    import { cn } from "$lib/components/utils/cn";

    let { class: className, children }: { class: string; children?: import("svelte").Snippet } = $props();
</script>

<div class={cn("[transform-style:preserve-3d]", className)}>
    {@render children?.()}
</div>
