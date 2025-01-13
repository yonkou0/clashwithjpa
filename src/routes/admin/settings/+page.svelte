<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import { toast } from "$lib/components/toast";
    import { Switch } from "bits-ui";
    import MaterialSymbolsSendRounded from "~icons/material-symbols/send-rounded";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();
    let applicationEnabled: boolean = $state(data.applicationEnabled);
    let disabled: boolean = $state(false);

    async function changeAppStatus() {
        disabled = true;
        const body = {
            key: "applications_enabled",
            value: applicationEnabled
        };
        let response = await fetch("/admin/api", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (response.ok) {
            toast.success(`Applications are ${applicationEnabled ? "enabled" : "disabled"} now`);
            invalidateAll();
            setTimeout(() => {
                disabled = false;
            }, 2000);
        } else {
            toast.error("Failed to set application status");
            setTimeout(() => {
                disabled = false;
            }, 2000);
        }
    }
</script>

<div class="flex size-full items-center justify-center">
    <div class="flex flex-col items-start justify-center gap-5">
        <div class="flex items-center gap-2">
            <span>Application Status</span>
            <Switch.Root
                name="applicationStatus"
                bind:checked={applicationEnabled}
                onCheckedChange={changeAppStatus}
                {disabled}
                class="inline-flex h-10 w-[70px] cursor-pointer items-center gap-11 rounded-full bg-gray-800 p-1 transition-all disabled:cursor-wait disabled:opacity-50 data-[state=checked]:bg-green-800"
            >
                <Switch.Thumb
                    class="pointer-events-none block size-9 shrink-0 rounded-full bg-gray-100 transition-all data-[state=checked]:translate-x-[75%] data-[state=unchecked]:translate-x-0"
                />
            </Switch.Root>
        </div>
        <div class="flex items-center gap-2">
            <span>Guild ID</span>
            <input
                type="number"
                class="rounded-lg border border-gray-700 bg-gray-800 transition-colors focus:border-blue-700 focus:ring-0"
                placeholder="Enter Guild ID"
                value={data.adminConfig.guildId}
            />
            <button
                class="h-full rounded-lg bg-gray-800 p-2 transition-all hover:bg-gray-700 disabled:cursor-wait disabled:opacity-50 disabled:hover:!bg-gray-800"
                {disabled}
            >
                <MaterialSymbolsSendRounded class="size-6" />
            </button>
        </div>
    </div>
</div>
