<script lang="ts">
	import { onMount } from 'svelte';
	import Services from '$lib/components/Services.svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();

	// Pass slug from URL to Services component
	const selectedSlug = $derived(data.slug || null);

	onMount(() => {
		// Initialize Lucide icons for detail pages
		if (typeof window !== 'undefined' && (window as any).lucide) {
			(window as any).lucide.createIcons();
		}
	});
</script>

<svelte:head>
	<script src="https://unpkg.com/lucide@latest"></script>
</svelte:head>

<!-- Services component with optional selected slug -->
<Services {selectedSlug} />

<!-- Slot for additional page content (if needed) -->
{@render children()}

