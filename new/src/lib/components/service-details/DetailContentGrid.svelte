<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { prefersReducedMotion } from 'svelte/motion';
	import type { Service } from '$lib/data/services';
	import WebsiteShowcase from './WebsiteShowcase.svelte';
	import ProjectGallery from './ProjectGallery.svelte';
	import LeadGenInfo from './LeadGenInfo.svelte';
	import MobileDesignDemo from './MobileDesignDemo.svelte';
	import SEOExplainer from './SEOExplainer.svelte';
	import SupportInfo from './SupportInfo.svelte';

	interface Props {
		service: Service;
	}

	let { service }: Props = $props();

	const shouldAnimate = $derived(!prefersReducedMotion.current);
</script>

<div class="detail-content-grid">
	<!-- Detail content based on service type -->
	<div class="detail-wrapper" transition:fade={{ duration: 400 }}>
		{#if service.detailContent.type === 'carousel'}
			<div
				class="detail-content-grid__carousel"
				transition:fly={{ y: 0, duration: 600, delay: 200, easing: quintOut }}
			>
				<WebsiteShowcase
					images={service.detailContent.images || []}
					text={service.detailContent.text || ''}
				/>
			</div>
		{:else if service.detailContent.type === 'gallery'}
			<div
				class="detail-content-grid__gallery"
				transition:fly={{ y: 0, duration: 600, delay: 200, easing: quintOut }}
			>
				<ProjectGallery
					categories={service.detailContent.categories || []}
					images={service.detailContent.images || []}
					text={service.detailContent.text || ''}
				/>
			</div>
		{:else if service.detailContent.type === 'text-icon'}
			<div
				transition:fly={{ y: 0, duration: 600, delay: 200, easing: quintOut }}
			>
				<LeadGenInfo
					text={service.detailContent.text}
					features={service.detailContent.features}
					stats={service.detailContent.stats}
					journeySteps={service.detailContent.journeySteps}
				/>
			</div>
		{:else if service.detailContent.type === 'phone-mockup'}
			<div
				transition:fly={{ y: 0, duration: 600, delay: 200, easing: quintOut }}
			>
				<MobileDesignDemo
					images={service.detailContent.images || []}
					text={service.detailContent.text || ''}
					stats={service.detailContent.stats || []}
				/>
			</div>
		{:else if service.detailContent.type === 'search-visual'}
			<div
				transition:fly={{ y: 0, duration: 600, delay: 200, easing: quintOut }}
			>
				<SEOExplainer
					images={service.detailContent.images || []}
					text={service.detailContent.text || ''}
					features={service.detailContent.features || []}
				/>
			</div>
		{:else if service.detailContent.type === 'support-info'}
			<div
				transition:fly={{ y: 0, duration: 600, delay: 200, easing: quintOut }}
			>
				<SupportInfo
					images={service.detailContent.images || []}
					text={service.detailContent.text || ''}
					features={service.detailContent.features || []}
				/>
			</div>
		{/if}
	</div>

	<!-- Additional hint text for mobile users -->
	<!-- <div class="interaction-hint" transition:fade={{ duration: 400, delay: 600 }}>
		<p>Click the card above to return to all services</p>
	</div> -->
</div>

<style>
	.detail-content-grid {
		width: 100%;
		display: grid;
		grid-template-columns: subgrid;
		grid-template-rows: subgrid;

		will-change: transform, opacity;
		transform: translateZ(0);
		backface-visibility: hidden;

		grid-column: 1 / -1;
		grid-row: 1 / -1;
	}

	.detail-wrapper {
		display: grid;
		grid-template-columns: subgrid;
		grid-template-rows: subgrid;
		grid-column: 1 / -1;
		grid-row: 1 / -1;
		overflow: hidden;
		
		background: rgba(15, 23, 42, 0.3);
		border: 1px solid rgba(96, 165, 250, 0.2);
		border-radius: var(--radius-sm);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

		@media (min-width: 769px) {
			padding: var(--spacing-md);
		}
	}

	.detail-content-grid__carousel,
	.detail-content-grid__gallery {
		display: grid;
		grid-template-columns: subgrid;
		grid-template-rows: subgrid;

		grid-column: 1 / -1;
		grid-row: 1 / -1;
	}

	@media (max-width: 768px) {
		.detail-wrapper {
			padding: var(--spacing-md);
			padding-top: 0;
		}
	}
</style>
