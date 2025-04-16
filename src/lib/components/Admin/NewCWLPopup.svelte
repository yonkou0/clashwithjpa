<script lang="ts">
    import { Dialog } from "bits-ui";
    import type { Snippet } from "svelte";
    import { fade } from "svelte/transition";
    import MaterialSymbolsCloseRounded from "~icons/material-symbols/close-rounded";

    interface Props {
        open?: boolean;
        children: Snippet;
    }
    let { open = $bindable(false), children }: Props = $props();
</script>

<Dialog.Root bind:open>
    <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 z-100 flex size-full items-center justify-center backdrop-blur-xs" forceMount>
            {#snippet child({ props, open })}
                {#if open}
                    <div {...props} transition:fade={{ duration: 100 }}>
                        <Dialog.Content
                            class="flex max-w-[90%] flex-col gap-5 rounded-lg border border-gray-700 bg-gray-900 p-5 text-sm md:max-w-[50%]"
                        >
                            <div class="flex flex-col gap-2 text-left">
                                <div class="flex items-center justify-between gap-2">
                                    <Dialog.Title class="text-xl font-extrabold">New CWL Application</Dialog.Title>
                                    <Dialog.Close class="cursor-pointer transition-all duration-200 hover:brightness-80">
                                        <MaterialSymbolsCloseRounded class="size-6" />
                                    </Dialog.Close>
                                </div>
                                {@render children()}
                            </div>
                        </Dialog.Content>
                    </div>
                {/if}
            {/snippet}
        </Dialog.Overlay>
    </Dialog.Portal>
</Dialog.Root>
