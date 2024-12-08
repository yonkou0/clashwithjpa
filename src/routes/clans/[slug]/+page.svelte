<script lang="ts">
	/* eslint-disable  @typescript-eslint/no-explicit-any */
	import type { PageData } from './$types';
	import Header from '$lib/components/header.svelte';
	import { MoveUpRight, ArrowDown, Plus, Minus, ArrowUp } from 'lucide-svelte';
	import { categorizeByRole } from '$lib/helpers';
	import { Accordion } from 'bits-ui';
	import { slide } from 'svelte/transition';
	import clsx from 'clsx';

	const commonComponentFiles: Record<string, object> = import.meta.glob(
		'../../../clans/components/*',
		{ eager: true }
	);

	const commonComponentOrder: string[] = [
		'toc.md',
		'general.md',
		'clanmate.md',
		'warrules.md',
		'fwawars.md',
		'strike.md',
		'raid.md',
		'cwl.md'
	];

	const basePath = '../../../clans/components/';

	type CommonComponent = {
		default: any;
		metadata: any;
	};

	const sortedCommonComponentFiles: Record<string, CommonComponent> = Object.entries(
		commonComponentFiles
	)
		.sort(([a], [b]) => {
			const aIndex = commonComponentOrder.indexOf(a.replace(basePath, ''));
			const bIndex = commonComponentOrder.indexOf(b.replace(basePath, ''));
			return aIndex - bIndex;
		})
		.reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

	export let data: PageData;
	console.log(data);
	const members = categorizeByRole(data.data.memberList);

	const proseLvl: Record<number, string> = {
		1: 'prose-sm',
		2: 'prose-base',
		3: 'prose-lg',
		4: 'prose-xl',
		5: 'prose-2xl'
	};
	let currentProseLvl = 1;

	function increaseProseLvl() {
		if (currentProseLvl < 5) {
			currentProseLvl++;
		}
	}

	function decreaseProseLvl() {
		if (currentProseLvl > 1) {
			currentProseLvl--;
		}
	}
</script>

<svelte:head>
	<title>{data.meta.title} | {data.slug}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
</svelte:head>

<Header />
<div class="flex w-full flex-col items-start gap-8 p-8 text-white md:px-24 lg:flex-row lg:px-32">
	<button
		on:click={() => {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}}
		class="fixed bottom-4 right-4 z-50 flex rounded-md bg-gray-700 p-2"
	>
		<ArrowUp class="size-6" />
	</button>
	<div class="flex w-full flex-col items-start lg:w-64">
		<div class="flex flex-row items-center gap-2 lg:flex-col lg:items-start lg:gap-0">
			<img class="size-14" src={data.data.badgeUrls.medium} alt={data.data.name} />
			<div class="flex flex-col items-start">
				<h1 class="font-heading text-lg font-semibold md:text-xl lg:text-2xl">{data.data.name}</h1>
				<p class="text-sm lg:hidden">{data.data.tag}</p>
			</div>
		</div>
		<p class="hidden text-sm lg:block">{data.data.tag}</p>
		<p class="mt-2 text-sm">Clan LVL. {data.data.clanLevel}</p>
		<p class="text-sm">Capital LVL. {data.data.clanCapital.capitalHallLevel}</p>
		<p class="mt-2 text-sm">
			Leader: <span
				class="bg-gradient-to-br from-orange-400 to-orange-600 bg-clip-text text-transparent"
				>{members.leader[0].name}</span
			>
		</p>
		<Accordion.Root class="">
			<Accordion.Item value="co-leaders">
				<Accordion.Header class="">
					<Accordion.Trigger class="flex items-center gap-2">
						<p class="text-sm">Co-Leaders</p>
						<div class="rounded-md p-1 transition-all duration-300 ease-in-out hover:bg-zinc-700">
							<ArrowDown class="size-4" />
						</div>
					</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Content transition={slide} transitionConfig={{ duration: 200 }} class="mt-1">
					<ul class="ml-4 list-disc">
						{#each members.coLeader as member (member.tag)}
							<li class="text-sm">{member.name}</li>
						{/each}
					</ul>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
		<a
			href={`https://link.clashofclans.com/en?action=OpenClanProfile&tag=${data.data.tag}`}
			target="_blank"
			rel="noopener"
			class="mt-4 flex items-center gap-x-1 font-semibold transition-all duration-300 ease-in-out hover:gap-x-2 hover:underline"
		>
			<p>View in-game</p>
			<MoveUpRight class="size-4" />
		</a>
	</div>

	<div
		class="w-full flex-1 marker:text-orange-400 prose-a:text-indigo-400 prose-blockquote:not-italic prose-blockquote:text-green-400 lg:border-l lg:border-zinc-700 lg:pl-4"
	>
		<article class={clsx('prose prose-invert w-full max-w-none', proseLvl[currentProseLvl])}>
			<div class="flex items-center justify-between">
				<h1 class="text-2xl underline underline-offset-4 md:text-3xl lg:text-4xl">Clan Rules</h1>
				<div class="flex items-center gap-2">
					<button
						disabled={currentProseLvl === 5}
						on:click={increaseProseLvl}
						class="rounded-md p-1 transition-all duration-300 ease-in-out hover:bg-zinc-700"
					>
						<Plus class="size-4" />
					</button>
					<button
						disabled={currentProseLvl === 1}
						on:click={decreaseProseLvl}
						class="rounded-md p-1 transition-all duration-300 ease-in-out hover:bg-zinc-700"
					>
						<Minus class="size-4" />
					</button>
				</div>
			</div>

			{#each Object.keys(sortedCommonComponentFiles) as componentFile}
				<svelte:component this={sortedCommonComponentFiles[componentFile].default} />
			{/each}

			<svelte:component this={data.content} />
		</article>
	</div>
</div>
