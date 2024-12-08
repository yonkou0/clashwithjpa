<script lang="ts">
	import Header from '$lib/components/header.svelte';
	import { clanTags } from '$lib/helpers';
</script>

<div class="h-custom relative z-[0] w-full overflow-hidden">
	<div class="z-[1] flex h-full">
		<!--TODO: Add poster="" later-->
		<video class="h-full w-full object-cover" autoplay loop muted>
			<source src="/videos/bgvideo.mp4" type="video/mp4" />
			<source src="/videos/bgvideo.webm" type="video/webm" />
			Your browser does not support the video tag.
		</video>
	</div>
	<div class="absolute inset-0 z-[2] flex bg-slate-900 opacity-50"></div>
	<div class="absolute inset-0 z-[3] flex flex-col text-white" id="mainDiv">
		<Header />
		<div class="flex flex-grow flex-col items-center justify-center p-8 md:px-24 lg:px-32">
			<div class="flex w-full max-w-2xl flex-col items-center justify-center text-center">
				<h1 class="text-3xl font-bold md:text-4xl lg:text-5xl">CLASH WITH JPA</h1>
				<p class="text-base md:text-lg lg:text-lg">
					FWA experts in War-Farming, offering diverse clans and simultaneous 50v50 FWA wars and CWL
					action. Join one of the {Object.keys(clanTags).length} clans in our family today!
				</p>

				<div class="mt-4 flex flex-wrap items-center gap-4">
					<a class="coc-btn px-4 py-1 text-sm font-bold" href="/clans">SEE OUR CLANS</a>
				</div>
			</div>
		</div>
	</div>
</div>
