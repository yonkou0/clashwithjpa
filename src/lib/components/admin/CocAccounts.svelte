<script lang="ts">
    interface Props {
        tags: string[];
    }
    let { tags }: Props = $props();
</script>

{tags.join(" | ")}