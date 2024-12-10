<script lang="ts">
    import { cn } from "$lib/components/utils/cn";

    interface Props {
        class?: string | undefined;
        translateX?: number | string | undefined;
        translateY?: number | string | undefined;
        translateZ?: number | string | undefined;
        rotateX?: number | string | undefined;
        rotateY?: number | string | undefined;
        rotateZ?: number | string | undefined;
        isMouseEntered?: boolean;
        children?: import("svelte").Snippet;
    }
    let {
        class: className = undefined,
        translateX = 0,
        translateY = 0,
        translateZ = 0,
        rotateX = 0,
        rotateY = 0,
        rotateZ = 0,
        isMouseEntered = false,
        children
    }: Props = $props();

    let ref: HTMLDivElement;

    $effect(() => {
        if (!ref) return;
        if (isMouseEntered) {
            ref.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
        } else {
            ref.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
        }
    });
</script>

<div bind:this={ref} class={cn("transition duration-200 ease-linear", className)}>
    {@render children?.()}
</div>
