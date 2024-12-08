<script>
	import '../app.pcss';
	import Footer from '$lib/components/footer.svelte';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import NProgress from 'nprogress';

	beforeNavigate(() => {
		NProgress.start();
	});
	afterNavigate(() => {
		NProgress.done();
	});
	NProgress.configure({
		showSpinner: false
	});
</script>

<div class="flex min-h-svh w-full flex-col overflow-x-hidden bg-primary font-primary">
	<slot />
	<Footer />
</div>
