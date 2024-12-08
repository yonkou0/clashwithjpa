<script lang="ts">
	import type { PageData } from './$types';
	import Header from '$lib/components/header.svelte';
	import { clanTags, labels } from '$lib/helpers';
	import { MoveUpRight, Loader2, Skull } from 'lucide-svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>JPA | Clans</title>
</svelte:head>

<div class="flex h-full w-full flex-col">
	<div
		class="h-60-custom md:h-60-custom relative z-[0] w-full overflow-hidden bg-cover bg-center"
		style="background-image: url('/images/banner01.webp');"
	>
		<div class="absolute inset-0 z-[1] flex bg-secondary opacity-60"></div>
		<div class="absolute inset-0 z-[3] flex flex-col text-white">
			<Header />
			<div class="flex flex-grow flex-col items-start p-8 md:px-24 lg:px-32">
				<h1 class="font-heading text-3xl font-semibold md:text-4xl lg:text-5xl">JPA Clans</h1>
				<p class="max-w-2xl text-base font-medium md:text-lg">
					With over {Object.keys(clanTags).length} clans we have a place for everyone. Clans range from
					LVL 14 to LVL 30+, each having their own rules and requirements. Find the right clan for you
					today!
				</p>
				<a
					href="https://discord.clashwithjpa.com"
					class="mt-4 flex items-center gap-x-1 font-semibold transition-all duration-300 ease-in-out hover:gap-x-2 hover:underline"
				>
					<p>Join our Discord</p>
					<MoveUpRight class="size-4" />
				</a>
			</div>
		</div>
	</div>
	{#await data.data}
		<div
			class="flex h-full w-full items-center justify-center gap-2 p-8 text-white md:px-24 lg:px-32"
		>
			<Loader2 class="size-10 animate-spin" />
			<p class="text-lg">Loading clans...</p>
		</div>
	{:then clans}
		<div class="flex w-full flex-col items-center text-white">
			<div class="max-w- grid w-full grid-cols-1 gap-4 p-8 py-20 md:px-24 lg:grid-cols-3 lg:px-32">
				{#each clans as clan (clan.tag)}
					<div
						class="flex flex-col justify-between rounded-md border border-zinc-700 bg-foreground"
					>
						<div
							class="flex items-center gap-1 rounded-t-md border-b border-zinc-700 bg-secondary p-4"
						>
							<img class="size-20" src={clan.badgeUrls.medium} alt={clan.name} />
							<div class="flex flex-col items-start">
								<h2 class="text-xl">{clan.name}</h2>
								<p class="text-xs">{clan.tag}</p>
								<p class="text-xs">LVL. {clan.clanLevel}</p>
							</div>
						</div>
						<div class="flex flex-col p-4 text-sm">
							<div class="flex flex-col items-start gap-2">
								<div class="flex items-center gap-1">
									<img class="size-8 min-w-8" src={labels.international.medium} alt="Members" />
									<p>{clan.members} Members</p>
								</div>
							</div>
							<div class="mt-4 flex flex-col items-start gap-2">
								<a
									href="/clans/{clan.tag.replace('#', '')}"
									class="flex items-center gap-x-1 text-sm font-semibold transition-all duration-300 ease-in-out hover:gap-x-2 hover:underline"
								>
									<p>Clan rules</p>
									<MoveUpRight class="size-4" />
								</a>
								<a
									href={`https://link.clashofclans.com/en?action=OpenClanProfile&tag=${clan.tag}`}
									class="flex items-center gap-x-1 text-sm font-semibold transition-all duration-300 ease-in-out hover:gap-x-2 hover:underline"
								>
									<p>Open in-game</p>
									<MoveUpRight class="size-4" />
								</a>
							</div>
						</div>
						<div class="flex w-full flex-col rounded-b-md border-t border-zinc-700 bg-secondary">
							<p class="border-b border-zinc-700 p-4 text-center text-sm">Minimum Requirements</p>
							<div class="flex w-full flex-col items-center justify-between xl:flex-row">
								<div
									class="flex h-full w-full flex-col items-center gap-2 border-b border-zinc-700 p-4 xl:border-b-0 xl:border-r"
								>
									<img class="size-8 min-w-8" src={labels.clanwars.medium} alt="Attacks" />
									<p class="text-center text-xs">{clanTags[clan.tag].attacks} Attacks</p>
								</div>
								<div
									class="flex h-full w-full flex-col items-center gap-2 border-b border-zinc-700 p-4 xl:border-b-0 xl:border-r"
								>
									<img class="size-8 min-w-8" src={labels.donations.medium} alt="Donations" />
									<p class="text-center text-xs">{clanTags[clan.tag].donations} Donations</p>
								</div>
								<div class="flex h-full w-full flex-col items-center gap-2 p-4">
									<img class="size-8 min-w-8" src={labels.clangames.medium} alt="Clan games" />
									<p class="text-center text-xs">
										{clanTags[clan.tag].clanGames} Clan Games Points
									</p>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{:catch}
		<div class="flex w-full items-center justify-center gap-2 p-8 text-white md:px-24 lg:px-32">
			<Skull class="size-10" />
			<p class="text-lg">Failed to load clans</p>
		</div>
	{/await}
</div>
