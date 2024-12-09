<script lang="ts">
    interface Props {
        class?: string;
        children: import("svelte").Snippet;
    }
    let { class: className = "", children }: Props = $props();
</script>

<h1
    class="font-extrabold shadow-gray-950 drop-shadow-[0_8px_0_var(--tw-shadow-color)] {className}"
    style="-webkit-text-stroke: 2px var(--tw-shadow-color);"
>
    {@render children?.()}
</h1>
