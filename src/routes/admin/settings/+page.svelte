<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import { toast } from "$lib/components/toast";
    import { Switch } from "bits-ui";
    import type { APIGuild, APIRole, APIUser } from "discord-api-types/v10";
    import MaterialSymbolsSendRounded from "~icons/material-symbols/send-rounded";
    import AdminItem from "../../../lib/components/AdminItem.svelte";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();
    let applicationEnabled: boolean = $state(data.applicationEnabled);
    let guildID: string = $state(data.adminConfig.guildId);
    let adminRoleID: string = $state("");
    let adminRoles: APIRole[] = $state(data.adminRoles);
    let adminID: string = $state("");
    let admins: APIUser[] = $state(data.admins);

    $effect(() => {
        applicationEnabled = data.applicationEnabled;
        guildID = data.adminConfig.guildId;
        adminRoles = data.adminRoles;
        admins = data.admins;
    });

    async function changeAppStatus() {
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
            toast.success(`Applications are now ${applicationEnabled ? "enabled" : "disabled"}`);
            invalidateAll();
        } else {
            toast.error("Failed to set application status");
        }
    }

    async function setGuildID() {
        const body = {
            key: "guild_id",
            value: { id: guildID.toString() }
        };
        let resp = await fetch("/admin/api", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (resp.ok) {
            const respData: APIGuild = await resp.json();
            toast.success(`Guild is set to ${respData.name}`);
            invalidateAll();
        } else {
            toast.error("Invalid Guild ID");
        }
    }

    async function setAdminRole() {
        const body = {
            key: "add_admin_role_id",
            value: adminRoleID.toString()
        };
        let resp = await fetch("/admin/api", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (resp.ok) {
            const respData: APIRole = await resp.json();
            toast.success(`Added role ${respData.name}`);
            invalidateAll();
        } else {
            toast.error("Invalid Role ID");
        }
        adminRoleID = "";
    }
    async function removeAdminRole(roleID: string) {
        const body = {
            key: "remove_admin_role_id",
            value: roleID
        };
        let resp = await fetch("/admin/api", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (resp.ok) {
            toast.success(`Removed role ${adminRoles.find((r) => r.id == roleID)?.name}`);
            invalidateAll();
        } else {
            toast.error("Failed to remove role");
        }
    }

    async function setAdmin() {
        const body = {
            key: "add_admin_id",
            value: adminID.toString()
        };
        let resp = await fetch("/admin/api", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (resp.ok) {
            const respData: APIUser = await resp.json();
            toast.success(`Added admin ${respData.username}`);
            invalidateAll();
        } else {
            toast.error("Invalid User ID");
        }
        adminID = "";
    }
    async function removeAdmin(adminID: string) {
        const body = {
            key: "remove_admin_id",
            value: adminID
        };
        let resp = await fetch("/admin/api", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        if (resp.ok) {
            toast.success(`Removed admin ${admins.find((a) => a.id == adminID)?.username}`);
            invalidateAll();
        } else {
            toast.error("Failed to remove admin");
        }
    }
</script>

<div class="flex size-full items-start justify-center overflow-auto p-5 md:p-11">
    <div class="flex flex-col items-start justify-center gap-5 md:gap-28 lg:flex-row 3xl:w-4/5">
        <div class="flex flex-col items-start justify-center gap-5">
            <!-- Application Status -->
            <div class="flex items-center gap-2">
                <span>Application Status</span>
                <Switch.Root
                    name="applicationStatus"
                    bind:checked={applicationEnabled}
                    onCheckedChange={changeAppStatus}
                    class="inline-flex h-8 w-[60px] cursor-pointer items-center gap-11 rounded-full bg-gray-800 p-1 transition-all disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-green-600"
                >
                    <Switch.Thumb
                        class="pointer-events-none block size-7 shrink-0 rounded-full bg-gray-100 transition-all data-[state=checked]:translate-x-[90%] data-[state=unchecked]:translate-x-0"
                    />
                </Switch.Root>
            </div>
            <!-- Guild ID -->
            <div class="flex flex-col items-start gap-2">
                <span>Guild ID</span>
                <div class="flex items-center gap-2">
                    <input
                        class="rounded-lg border border-gray-700 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 transition-all focus:border-blue-700 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter Guild ID"
                        maxlength="19"
                        bind:value={guildID}
                    />
                    <button
                        class="h-full rounded-lg bg-gray-800 p-2 transition-all hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:!bg-gray-800"
                        onclick={setGuildID}
                    >
                        <MaterialSymbolsSendRounded class="size-6" />
                    </button>
                </div>
            </div>
        </div>
        <div class="flex flex-col items-start justify-center gap-5">
            <!-- Admin Roles -->
            <AdminItem
                title="Admin Roles"
                placeholder="Enter Role ID"
                bind:inputValue={adminRoleID}
                onSubmit={setAdminRole}
                items={adminRoles}
                removeItem={removeAdminRole}
            />
            <!-- Admins -->
            <AdminItem
                title="Admins"
                placeholder="Enter User ID"
                bind:inputValue={adminID}
                onSubmit={setAdmin}
                items={admins}
                removeItem={removeAdmin}
            />
        </div>
    </div>
</div>
