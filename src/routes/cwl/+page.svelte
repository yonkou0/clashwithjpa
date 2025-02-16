<script lang="ts">
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();
</script>

<div class="mt-32 flex flex-col gap-2 p-4 font-mono">
    <pre>
        {JSON.stringify(data, null, 2)}
    </pre>

    <p>so here, users will see a dropdown of their cocAccounts, they select one and put preference number (integer) in it</p>

    <div class="flex w-full flex-col gap-4">
        {#if data.userAccount}
            <select class="rounded-lg border border-gray-700 text-black" name="cocAccount">
                {#each data.userAccount.cocAccounts as cocAccount}
                    <option value={cocAccount.userId}>{cocAccount.userId}</option>
                {/each}
            </select>

            <input
                type="number"
                name="preference"
                min="1"
                max="10"
                class="rounded-lg border border-gray-700"
                placeholder="Preference Number from 1 - max alts (to be fetched)"
            />
        {/if}
    </div>

    <p>now cwl table has these</p>
    <pre>
        id: serial("id").primaryKey(),
        userId: text("user_id")
        userName: text("user_name").notNull(),
        accountName: text("account_name").notNull(),
        accountTag: text("account_tag")
        accountClan: text("account_clan").notNull(),
        accountWeight: integer("account_weight").notNull(),
        month: text("month").notNull(),
        year: integer("year").notNull(),
        preferenceNum: integer("preference_num").notNull(),
        appliedAt: timestamp("applied_at").notNull().defaultNow()
    </pre>

    <p>user can only manage account_tag and preference_num, rest we insert (except id and applied_at they automatic)</p>

    <ul class="px-16">
        <li>user id we get from locals.user</li>
        <li>usename from locals.user</li>
        <li>account name we get from FWA Stats</li>
        <li>account tag, user selected one,,, need to make sure it's in db when checking</li>
        <li>account clan, need to think hmmmmmmm</li>
        <li>account weight from fwa stats</li>
        <li>month, in text, from datetime</li>
        <li>year number datetime</li>
        <li>preference number, user selected</li>
    </ul>

    <p class="font-bold text-red-400">issue is account clan, we don't know that,,, so can't get fwa stats</p>

    <p class="font-bold text-yellow-400">for now focus on ui, functionality later</p>
</div>

