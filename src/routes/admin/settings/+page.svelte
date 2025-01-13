<script lang="ts">
    import { Switch } from "bits-ui";
    import type { PageData } from "./$types";
    import { toast } from "$lib/components/toast";
    import { invalidateAll } from "$app/navigation";

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
    <div class="flex items-center gap-2">
        <span>Application Status</span>
        <Switch.Root
            name="applicationStatus"
            bind:checked={applicationEnabled}
            onCheckedChange={changeAppStatus}
            {disabled}
            class="inline-flex h-11 w-20 cursor-pointer items-center gap-11 rounded-full bg-gray-800 p-1 transition-all disabled:cursor-wait disabled:opacity-50 data-[state=checked]:bg-green-800"
        >
            <Switch.Thumb
                class="pointer-events-none block size-10 shrink-0 rounded-full bg-gray-100 transition-all data-[state=checked]:translate-x-[80%] data-[state=unchecked]:translate-x-0"
            />
        </Switch.Root>
    </div>
</div>
