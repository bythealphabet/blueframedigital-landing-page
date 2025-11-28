<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import ScrollProgress from '$lib/components/ScrollProgress.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import BackToTop from '$lib/components/BackToTop.svelte';
	import '../app.css';

	let { children } = $props();

	// Implement smooth page transitions using View Transitions API
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="alternate icon" href="/favicon.ico" />
</svelte:head>

<ScrollProgress />
{@render children()}
<Footer />
<BackToTop />
