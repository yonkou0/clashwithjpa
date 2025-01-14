<script lang="ts">
    import { invalidateAll } from "$app/navigation";
    import { toast } from "$lib/components/toast";
    import { Switch, Tooltip } from "bits-ui";
    import type { APIGuild, APIRole, APIUser } from "discord-api-types/v10";
    import { expoIn, expoOut } from "svelte/easing";
    import { fly } from "svelte/transition";
    import MaterialSymbolsCloseRounded from "~icons/material-symbols/close-rounded";
    import MaterialSymbolsSendRounded from "~icons/material-symbols/send-rounded";
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

        if (guildID == data.adminConfig.guildId) {
            disabled.guildID.button = true;
        } else {
            disabled.guildID.button = false;
        }

        if (adminRoleID.length == 0 || adminRoles.find((r) => r.id == adminRoleID)) {
            disabled.role.button = true;
        } else {
            disabled.role.button = false;
        }

        if (adminID.length == 0 || admins.find((a) => a.id == adminID)) {
            disabled.admins.button = true;
        } else {
            disabled.admins.button = false;
        }
    });

    let disabled: {
        applicationStatus: boolean;
        guildID: {
            input: boolean;
            button: boolean;
        };
        role: {
            input: boolean;
            button: boolean;
        };
        admins: {
            input: boolean;
            button: boolean;
        };
    } = $state({
        applicationStatus: false,
        guildID: {
            input: false,
            button: true
        },
        role: {
            input: false,
            button: false
        },
        admins: {
            input: false,
            button: false
        }
    });

    async function changeAppStatus() {
        disabled.applicationStatus = true;
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
            setTimeout(() => {
                disabled.applicationStatus = false;
            }, 2000);
        } else {
            toast.error("Failed to set application status");
            setTimeout(() => {
                disabled.applicationStatus = false;
            }, 2000);
        }
    }

    async function setGuildID() {
        disabled.guildID.input = true;
        disabled.guildID.button = true;
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
            setTimeout(() => {
                disabled.guildID.input = false;
                disabled.guildID.button = false;
            }, 2000);
        } else {
            toast.error("Invalid Guild ID");
            setTimeout(() => {
                disabled.guildID.input = false;
                disabled.guildID.button = false;
            }, 2000);
        }
    }

    async function setAdminRole() {
        disabled.role.input = true;
        disabled.role.button = true;
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
            setTimeout(() => {
                disabled.role.input = false;
                disabled.role.button = false;
            }, 2000);
        } else {
            toast.error("Invalid Role ID");
            setTimeout(() => {
                disabled.role.input = false;
                disabled.role.button = false;
            }, 2000);
        }
        adminRoleID = "";
    }
    async function removeAdminRole(roleID: string) {
        disabled.role.input = true;
        disabled.role.button = true;
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
            setTimeout(() => {
                disabled.role.input = false;
                disabled.role.button = false;
            }, 2000);
        } else {
            toast.error("Failed to remove role");
            setTimeout(() => {
                disabled.role.input = false;
                disabled.role.button = false;
            }, 2000);
        }
    }

    async function setAdmin() {
        disabled.admins.input = true;
        disabled.admins.button = true;
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
            setTimeout(() => {
                disabled.admins.input = false;
                disabled.admins.button = false;
            }, 2000);
        } else {
            toast.error("Invalid User ID");
            setTimeout(() => {
                disabled.admins.input = false;
                disabled.admins.button = false;
            }, 2000);
        }
        adminID = "";
    }
    async function removeAdmin(adminID: string) {
        disabled.admins.input = true;
        disabled.admins.button = true;
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
            setTimeout(() => {
                disabled.admins.input = false;
                disabled.admins.button = false;
            }, 2000);
        } else {
            toast.error("Failed to remove admin");
            setTimeout(() => {
                disabled.admins.input = false;
                disabled.admins.button = false;
            }, 2000);
        }
    }
</script>

<div class="size-full p-5 md:p-11 overflow-scroll">
    <div class="flex flex-col items-start justify-center gap-5 md:flex-row md:gap-28">
        <div class="flex flex-col items-start justify-center gap-5">
            <!-- Application Status -->
            <div class="flex items-center gap-2">
                <span>Application Status</span>
                <Switch.Root
                    name="applicationStatus"
                    bind:checked={applicationEnabled}
                    onCheckedChange={changeAppStatus}
                    disabled={disabled.applicationStatus}
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
                        disabled={disabled.guildID.input}
                    />
                    <button
                        class="h-full rounded-lg bg-gray-800 p-2 transition-all hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:!bg-gray-800"
                        onclick={setGuildID}
                        disabled={disabled.guildID.button}
                    >
                        <MaterialSymbolsSendRounded class="size-6" />
                    </button>
                </div>
            </div>
        </div>
        <div class="flex size-full flex-col items-start justify-center gap-5">
            <!-- Admin Roles -->
            <div class="flex flex-col items-start justify-center gap-2">
                <span>Admin Roles</span>
                <div class="flex items-center gap-2">
                    <input
                        class="rounded-lg border border-gray-700 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 transition-all focus:border-blue-700 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter Role ID"
                        maxlength="19"
                        bind:value={adminRoleID}
                        disabled={disabled.role.input}
                    />
                    <button
                        class="h-full rounded-lg bg-gray-800 p-2 transition-all hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:!bg-gray-800"
                        onclick={setAdminRole}
                        disabled={disabled.role.button}
                    >
                        <MaterialSymbolsSendRounded class="size-6" />
                    </button>
                </div>
                <div class="flex flex-wrap gap-2 overflow-hidden">
                    {#each adminRoles as role}
                        <div
                            in:fly={{ duration: 500, easing: expoIn, x: -100, y: 0 }}
                            out:fly={{ duration: 500, easing: expoOut, x: 100, y: 0 }}
                            class="flex flex-col rounded-xl border border-gray-700 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-2"
                        >
                            <div class="flex items-center justify-start gap-2" class:opacity-50={disabled.role.input}>
                                <button
                                    onclick={() => {
                                        removeAdminRole(role.id);
                                    }}
                                    disabled={disabled.role.input}
                                    class="group flex size-4 items-center justify-center rounded-full bg-gray-500 p-0.5 text-gray-950 disabled:cursor-not-allowed"
                                    style="background-color: #{role.color}"
                                >
                                    <MaterialSymbolsCloseRounded class="size-fit opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                                </button>
                                <Tooltip.Provider>
                                    <Tooltip.Root delayDuration={200}>
                                        <Tooltip.Trigger class="cursor-default">
                                            <p>{role.name.length >= 10 ? `${role.name.slice(0, 10)}...` : role.name}</p>
                                        </Tooltip.Trigger>
                                        <Tooltip.Content
                                            class="rounded-lg border border-gray-700 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-2 text-sm"
                                        >
                                            <p>{role.name}</p>
                                        </Tooltip.Content>
                                    </Tooltip.Root>
                                </Tooltip.Provider>
                            </div>
                            <span class="text-xs text-gray-400">{role.id}</span>
                        </div>
                    {/each}
                </div>
            </div>
            <!-- Admins -->
            <div class="flex flex-col items-start justify-center gap-2">
                <span>Admins</span>
                <div class="flex items-start justify-center gap-2">
                    <input
                        class="rounded-lg border border-gray-700 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 transition-all focus:border-blue-700 focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter User ID"
                        maxlength="19"
                        bind:value={adminID}
                        disabled={disabled.admins.input}
                    />
                    <button
                        class="h-full rounded-lg bg-gray-800 p-2 transition-all hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:!bg-gray-800"
                        onclick={setAdmin}
                        disabled={disabled.admins.button}
                    >
                        <MaterialSymbolsSendRounded class="size-6" />
                    </button>
                </div>
                <div class="flex flex-wrap gap-2 overflow-hidden">
                    {#each admins as admin}
                        <div
                            in:fly={{ duration: 500, easing: expoIn, x: -100, y: 0 }}
                            out:fly={{ duration: 500, easing: expoOut, x: 100, y: 0 }}
                            class="flex flex-col rounded-xl border border-gray-700 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-2"
                        >
                            <div class="flex items-center justify-start gap-2" class:opacity-50={disabled.admins.input}>
                                <button
                                    onclick={() => {
                                        removeAdmin(admin.id);
                                    }}
                                    disabled={disabled.admins.input}
                                    class="group flex size-4 items-center justify-center rounded-full bg-gray-500 p-0.5 text-gray-950 disabled:cursor-not-allowed"
                                    style="background-color: #{admin.accent_color}"
                                >
                                    <MaterialSymbolsCloseRounded class="size-fit opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                                </button>
                                <Tooltip.Provider>
                                    <Tooltip.Root delayDuration={200}>
                                        {@const adminName = admin.global_name || admin.username}
                                        <Tooltip.Trigger class="cursor-default">
                                            <p>{adminName.length >= 10 ? `${adminName.slice(0, 10)}...` : adminName}</p>
                                        </Tooltip.Trigger>
                                        <Tooltip.Content
                                            class="rounded-lg border border-gray-700 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-2 text-sm"
                                        >
                                            <p>{adminName}</p>
                                        </Tooltip.Content>
                                    </Tooltip.Root>
                                </Tooltip.Provider>
                            </div>
                            <span class="text-xs text-gray-400">{admin.id}</span>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>
