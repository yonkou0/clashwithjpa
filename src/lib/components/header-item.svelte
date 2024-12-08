<script lang="ts">
	import { page } from '$app/stores';
	import type { NavItemType } from '$lib/types';
	import clsx from 'clsx';

	export let navItem: NavItemType;
</script>

<a
	href={navItem.path}
	class={clsx(
		'slide-to-right relative text-sm text-slate-100 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-slate-100 after:transition-transform after:duration-300 after:ease-in-out',
		{
			'after:origin-bottom-left after:scale-x-100 hover:after:origin-bottom-right hover:after:scale-x-0':
				$page.url.pathname === navItem.path
		},
		{
			'after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100':
				$page.url.pathname !== navItem.path
		}
	)}
>
	{navItem.name}
</a>
