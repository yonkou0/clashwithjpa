<script lang="ts">
    import { cn } from "$lib/components/utils/cn";
    import type { Snippet } from "svelte";

    let { class: className, children }: { class: string; children?: Snippet } = $props();
</script>

<div class={cn("[transform-style:preserve-3d]", className)}>
    {@render children?.()}
</div>
