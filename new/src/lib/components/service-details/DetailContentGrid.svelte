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
				transition:fly={{ y: shouldAnimate ? 20 : 0, duration: 600, delay: 200, easing: quintOut }}
			>
				<WebsiteShowcase
					images={service.detailContent.images || []}
					text={service.detailContent.text || ''}
				/>
			</div>
		{:else if service.detailContent.type === 'gallery'}
			<div
				transition:fly={{ y: shouldAnimate ? 20 : 0, duration: 600, delay: 200, easing: quintOut }}
			>
				<ProjectGallery
					images={service.detailContent.images || []}
					text={service.detailContent.text || ''}
				/>
			</div>
		{:else if service.detailContent.type === 'text-icon'}
			<div
				transition:fly={{ y: shouldAnimate ? 20 : 0, duration: 600, delay: 200, easing: quintOut }}
			>
				<LeadGenInfo
					text={service.detailContent.text || ''}
					features={service.detailContent.features || []}
					stats={service.detailContent.stats || []}
				/>
			</div>
		{:else if service.detailContent.type === 'phone-mockup'}
			<div
				transition:fly={{ y: shouldAnimate ? 20 : 0, duration: 600, delay: 200, easing: quintOut }}
			>
				<MobileDesignDemo
					images={service.detailContent.images || []}
					text={service.detailContent.text || ''}
					stats={service.detailContent.stats || []}
				/>
			</div>
		{:else if service.detailContent.type === 'search-visual'}
			<div
				transition:fly={{ y: shouldAnimate ? 20 : 0, duration: 600, delay: 200, easing: quintOut }}
			>
				<SEOExplainer
					images={service.detailContent.images || []}
					text={service.detailContent.text || ''}
					features={service.detailContent.features || []}
				/>
			</div>
		{:else if service.detailContent.type === 'support-info'}
			<div
				transition:fly={{ y: shouldAnimate ? 20 : 0, duration: 600, delay: 200, easing: quintOut }}
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
	<div class="interaction-hint" transition:fade={{ duration: 400, delay: 600 }}>
		<p>Click the card above to return to all services</p>
	</div>
</div>

<style>
	.detail-content-grid {
		width: 100%;
		display: grid;
		grid-template-columns: subgrid;
		grid-template-rows: subgrid;
		gap: var(--spacing-lg);

		will-change: transform, opacity;
		transform: translateZ(0);
		backface-visibility: hidden;

		grid-column: 1 / -1;
		grid-row: 1 / -1;
	}

	.detail-wrapper {
		padding: var(--spacing-xl);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

		display: grid;
		grid-template-columns: subgrid;
		grid-template-rows: subgrid;
		grid-column: 1 / -1;
		grid-row: 1 / -1;
	}

	.detail-content-grid__carousel {
		display: grid;
		grid-template-columns: subgrid;
		grid-template-rows: subgrid;
		grid-gap: var(--spacing-md);

		grid-column: 1 / -1;
		grid-row: 1 / -1;
	}

	.interaction-hint {
		text-align: center;
		padding: var(--spacing-md);
		background: rgba(37, 99, 235, 0.1);
		border: 1px solid var(--primary-blue);
		border-radius: var(--radius-sm);
	}

	.interaction-hint p {
		color: var(--text-tertiary);
		font-size: var(--font-size-sm);
		margin: 0;
	}

	@media (max-width: 768px) {
		.detail-wrapper {
			padding: var(--spacing-lg);
		}

		.interaction-hint {
			position: sticky;
			bottom: var(--spacing-md);
			background: rgba(15, 23, 42, 0.95);
			backdrop-filter: blur(10px);
		}
	}

	@media (min-width: 769px) {
		.interaction-hint {
			display: none;
		}
	}
</style>
