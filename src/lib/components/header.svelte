<script lang="ts">
	import type { NavItemType } from '$lib/types';
	import HeaderItem from '$lib/components/header-item.svelte';
	import { page } from '$app/stores';
	import { Menu, X } from 'lucide-svelte';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	const navItems: NavItemType[] = [
		{
			name: 'HOME',
			path: '/'
		},
		{
			name: 'CLANS',
			path: '/clans'
		},
		{
			name: 'DISCORD',
			path: 'https://discord.clashwithjpa.com/'
		}
	];

	let showMenu = writable(false);
	setContext('showMenu', showMenu);

	function toggleNavbar() {
		$showMenu = !$showMenu;
	}
</script>

<header class="flex items-center justify-between p-8 md:px-24 lg:px-32">
	<a href="/" class="flex items-center gap-1">
		<img class="size-12" src="/logo.png" alt="JPA Logo" />
		<h1 class="text-2xl font-bold text-white">JPA</h1>
	</a>
	<div class="flex items-center gap-x-6 font-bold">
		<nav class="hidden items-center gap-x-4 font-bold md:flex">
			{#each navItems as navItem}
				<HeaderItem {navItem} />
			{/each}
		</nav>
		<div class="flex items-center gap-x-4">
			<a class="coc-btn px-4 py-1 text-sm" href="https://discord.clashwithjpa.com/">JOIN US</a>
			<button on:click={toggleNavbar} class="block text-white md:hidden">
				<Menu class="size-8" />
			</button>
		</div>
	</div>
</header>

<div
	id="mobilenav"
	class:h-0={!$showMenu}
	class:h-screen={$showMenu}
	class:h-svh={$showMenu}
	class="bg-background fixed left-0 top-0 z-[99] flex h-0 w-screen flex-col items-center overflow-x-hidden bg-black lg:hidden"
>
	<div
		class="flex w-full items-end justify-end p-8 transition-all duration-300 ease-in-out md:px-24 lg:px-32"
	>
		<button on:click={toggleNavbar} class="text-white">
			<X class="h-8 w-8" />
		</button>
	</div>
	<div class="flex w-full flex-col items-center justify-center gap-4 p-8 md:px-24">
		{#each navItems as item}
			<button on:click={toggleNavbar}>
				<a
					class:underline={$page.url.pathname === item.path}
					class:text-slate-100={$page.url.pathname === item.path}
					class:text-slate-200={$page.url.pathname !== item.path}
					href={item.path}
					class="text-lg font-semibold underline-offset-4 transition-all duration-300 hover:text-slate-100 hover:underline"
					>{item.name}</a
				>
			</button>
		{/each}
	</div>
</div>

<style>
	#mobilenav {
		transition: all 0.5s ease-in-out;
	}
</style>
