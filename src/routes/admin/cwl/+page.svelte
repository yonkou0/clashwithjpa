<script lang="ts">
    import CWLApplications from "$lib/components/Admin/CWLApplications.svelte";
    import { fade } from "svelte/transition";
    import type { PageData } from "./$types";

    interface CWLApplicationsType {
        id: number;
        userId: string;
        userName: string;
        accountName: string;
        accountTag: string;
        accountClan: string;
        accountWeight: number;
        month: string;
        year: number;
        preferenceNum: number;
        appliedAt: Date;
    }

    let { data }: { data: PageData } = $props();

    const applications = data.cwlApplications as CWLApplicationsType[];

    const columns = [
        {
            id: "userName",
            header: "User Name",
            flexgrow: 1,
            sort: true,
            editor: "text",
        },
        {
            id: "accountName",
            header: "Account Name",
            flexgrow: 1,
            sort: true,
            editor: "text",
        },
        {
            id: "accountTag",
            header: "Account Tag",
            flexgrow: 1,
            sort: true,
            editor: "text",
        },
        {
            id: "accountClan",
            header: "Account Clan",
            flexgrow: 1,
            sort: true,
            editor: "text",
        },
        {
            id: "accountWeight",
            header: "Account Weight",
            width: 100,
            sort: true,
            editor: "text",
        },
    ];
</script>

<div class="p-5 md:p-11" in:fade>
    <h1 class="text-3xl font-bold md:text-4xl">Clan War League</h1>
</div>
