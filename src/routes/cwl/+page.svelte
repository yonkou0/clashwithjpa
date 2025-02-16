<script lang="ts">
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();
</script>

<pre class="mt-32">
    {JSON.stringify(data, null, 2)}
</pre>