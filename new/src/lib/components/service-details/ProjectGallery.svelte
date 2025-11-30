<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { prefersReducedMotion } from 'svelte/motion';
	import { onMount } from 'svelte';

	interface GalleryFeature {
		image: string;
		video?: string;
		title: string;
		description: string;
		features: string[];
	}

	interface Props {
		galleries?: GalleryFeature[];
		// Backward compatibility
		images?: string[];
		text?: string;
	}

	let { galleries = [], images = [], text = '' }: Props = $props();

	// State variables
	let currentIndex = $state(0);
	let isAutoPlaying = $state(true);
	let containerElement: HTMLElement;

	// Default gallery features showcase
	const defaultGalleries: GalleryFeature[] = [
		{
			image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800',
			title: 'Smart Search & Filtering',
			description: 'Powerful search functionality that helps clients find exactly what they need',
			features: ['Full-text search', 'Filter by tags', 'Date range filtering', 'Quick filters']
		},
		{
			image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
			title: 'Client Project Management',
			description: 'Organize projects with client details, addresses, and project metadata',
			features: [
				'Client information',
				'Project addresses',
				'Custom categories',
				'Project status tracking'
			]
		},
		{
			image: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=800',
			title: 'Tagging System',
			description: 'Flexible tagging system to categorize and organize your portfolio',
			features: [
				'Custom tags',
				'Color-coded labels',
				'Tag-based filtering',
				'Bulk tag editing'
			]
		},
		{
			image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
			title: 'Portfolio Showcase',
			description: 'Beautiful gallery layouts to showcase your best work to potential clients',
			features: [
				'Multiple layout options',
				'Lightbox view',
				'Before/after sliders',
				'Project details'
			]
		},
		{
			image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
			title: 'Analytics & Insights',
			description: 'Track which projects get the most attention and engagement',
			features: [
				'View statistics',
				'Popular projects',
				'Client engagement',
				'Performance metrics'
			]
		}
	];

	// Handle both new format and old format
	const displayGalleries = $derived.by(() => {
		if (galleries.length > 0) {
			return galleries;
		}
		
		// Backward compatibility: convert old format
		if (images.length > 0) {
			return images.map((img, idx) => ({
				image: img,
				title: `Gallery Feature ${idx + 1}`,
				description: text || defaultGalleries[idx % defaultGalleries.length].description,
				features: defaultGalleries[idx % defaultGalleries.length].features
			}));
		}
		
		return defaultGalleries;
	});

	const currentGallery = $derived(displayGalleries[currentIndex]);
	const shouldAnimate = !prefersReducedMotion.current;

	onMount(() => {
		const interval = setInterval(() => {
			if (isAutoPlaying && displayGalleries.length > 1) {
				currentIndex = (currentIndex + 1) % displayGalleries.length;
			}
		}, 6000);

		// Initialize Lucide icons
		if (typeof window !== 'undefined' && (window as any).lucide) {
			(window as any).lucide.createIcons();
		}

		return () => clearInterval(interval);
	});

	function selectSlide(index: number) {
		currentIndex = index;
		isAutoPlaying = false;
		// Resume auto-play after 10 seconds
		setTimeout(() => {
			isAutoPlaying = true;
		}, 10000);
	}

	function getCardClass(index: number): string {
		const totalCards = displayGalleries.length;
		if (index === currentIndex) return 'active';

		const diff = (index - currentIndex + totalCards) % totalCards;

		if (diff === 1 || diff === totalCards - (totalCards - 1)) {
			return 'next';
		} else if (diff === totalCards - 1 || diff === -(totalCards - 1)) {
			return 'prev';
		}
		return 'hidden';
	}
</script>

<div
	class="gallery-showcase"
	bind:this={containerElement}
	transition:fly={{ y: shouldAnimate ? 40 : 0, duration: 600, easing: quintOut }}
>
	<div class="carousel-container">
		<div class="cards">
			{#each displayGalleries as gallery, i (i)}
				{@const cardClass = getCardClass(i)}
				<button
					class="card {cardClass}"
					onclick={() => selectSlide(i)}
					aria-label="View gallery feature {i + 1}"
					tabindex={cardClass === 'active' ? 0 : -1}
				>
					<img src={gallery.image} alt={gallery.title} loading="lazy" />
				</button>
			{/each}
		</div>

		{#if displayGalleries.length > 1}
			<div class="controls" transition:fade={{ delay: 400 }}>
				<div class="dots">
					{#each displayGalleries as _, i}
						<button
							class="dot"
							class:active={i === currentIndex}
							onclick={() => selectSlide(i)}
							aria-label="Go to slide {i + 1}"
						>
							<span class="dot-inner"></span>
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>

	{#key currentIndex}
		<div
			class="feature-content"
			transition:fly={{ y: shouldAnimate ? 20 : 0, duration: 600, delay: 150, easing: quintOut }}
		>
			<h3 class="feature-title">{currentGallery.title}</h3>
			<p class="feature-description">{currentGallery.description}</p>
			
			<div class="features-list">
				{#each currentGallery.features as feature, i}
					<div
						class="feature-item"
						transition:fly={{ x: shouldAnimate ? -20 : 0, duration: 400, delay: 200 + i * 50 }}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="check-icon"
						>
							<polyline points="20 6 9 17 4 12"></polyline>
						</svg>
						<span>{feature}</span>
					</div>
				{/each}
			</div>
		</div>
	{/key}
</div>

<style lang="scss">
	.gallery-showcase {
		width: 100%;
		display: grid;
		grid-template-columns: subgrid;
		grid-template-rows: 1fr auto;
		gap: var(--spacing-xl);
		padding: var(--spacing-lg);

		grid-column: 1 / -1;
		grid-row: 1 / -1;
		
		@media (max-width: 768px) {
			grid-template-rows: minmax(280px, 1fr) auto;
			padding: var(--spacing-md);
			gap: var(--spacing-lg);
		}
	}

	.carousel-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-lg);
		transform-style: preserve-3d;
		perspective: 1200px;
		
		grid-column: 1 / -1;
		grid-row: 1;
		min-height: 0;
		z-index: 2;
		position: relative;
	}

	.cards {
		position: relative;
		width: 100%;
		height: 100%;
		max-height: 450px;
		min-height: 200px;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		transform-style: preserve-3d;
		perspective: 1200px;

		@media (max-width: 768px) {
			max-height: 280px;
			min-height: 180px;
		}
	}

	.card {
		position: absolute;
		width: 70%;
		height: 100%;
		border-radius: var(--radius-sm);
		overflow: hidden;
		border: 2px solid var(--primary-blue);
		background: var(--background-card);
		cursor: pointer;
		transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
		transform-style: preserve-3d;
		will-change: transform, opacity;
		padding: 0;

		&::before {
			content: '';
			position: absolute;
			inset: 0;
			background: linear-gradient(
				135deg,
				rgba(96, 165, 250, 0.1) 0%,
				transparent 50%,
				rgba(37, 99, 235, 0.1) 100%
			);
			opacity: 0;
			transition: opacity 0.4s ease;
			z-index: 1;
			pointer-events: none;
		}

		&:focus {
			outline: 2px solid var(--primary-blue-bright);
			outline-offset: 4px;
		}

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			display: block;
			transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
		}

		&.active {
			transform: translateX(0) scale(1) translateZ(0);
			opacity: 1;
			z-index: 10;
			box-shadow:
				0 20px 60px rgba(0, 0, 0, 0.4),
				0 0 40px rgba(96, 165, 250, 0.2);
			border-color: var(--primary-blue-bright);

			&::before {
				opacity: 1;
			}

			&:hover img {
				transform: scale(1.05);
			}
		}

		&.next {
			transform: translateX(45%) scale(0.85) translateZ(-100px);
			opacity: 0.6;
			z-index: 5;
			filter: brightness(0.7);

			&:hover {
				opacity: 0.8;
				transform: translateX(45%) scale(0.88) translateZ(-80px);
			}
		}

		&.prev {
			transform: translateX(-45%) scale(0.85) translateZ(-100px);
			opacity: 0.6;
			z-index: 5;
			filter: brightness(0.7);

			&:hover {
				opacity: 0.8;
				transform: translateX(-45%) scale(0.88) translateZ(-80px);
			}
		}

		&.hidden {
			transform: translateX(0) scale(0.5) translateZ(-200px);
			opacity: 0;
			z-index: 0;
			pointer-events: none;
		}

		@media (max-width: 768px) {
			width: 85%;

			&.next {
				transform: translateX(50%) scale(0.75) translateZ(-100px);
			}

			&.prev {
				transform: translateX(-50%) scale(0.75) translateZ(-100px);
			}
		}
	}

	.controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-lg);
		margin-top: var(--spacing-md);
	}

	.dots {
		display: flex;
		gap: var(--spacing-md);
		padding: var(--spacing-sm);
		background: rgba(15, 23, 42, 0.6);
		border-radius: 999px;
		border: 1px solid var(--primary-blue);
		backdrop-filter: blur(10px);
	}

	.dot {
		position: relative;
		width: 14px;
		height: 14px;
		padding: 0;
		background: transparent;
		border: none;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

		&:hover .dot-inner {
			background: var(--primary-blue-light);
			transform: scale(1.3);
		}

		&:focus {
			outline: 2px solid var(--primary-blue-bright);
			outline-offset: 3px;
			border-radius: 50%;
		}
	}

	.dot-inner {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		background: rgba(96, 165, 250, 0.4);
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.dot.active .dot-inner {
		background: var(--primary-blue-bright);
		transform: scale(1.4);
		box-shadow: 0 0 12px rgba(96, 165, 250, 0.8);
	}

	.feature-content {
		grid-column: 1 / -1;
		grid-row: 2;
		
		max-width: 900px;
		width: 100%;
		justify-self: center;
		text-align: center;
		padding: var(--spacing-xl);
		background: rgba(15, 23, 42, 0.6);
		border: 1px solid var(--primary-blue);
		border-radius: var(--radius-sm);
		backdrop-filter: blur(10px);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-lg);
		
		@media (max-width: 768px) {
			padding: var(--spacing-lg);
			gap: var(--spacing-md);
		}
	}

	.feature-title {
		color: var(--primary-blue-bright);
		font-size: var(--font-size-2xl);
		font-weight: 700;
		margin: 0;
		text-shadow: 0 0 20px rgba(96, 165, 250, 0.3);
		
		@media (max-width: 768px) {
			font-size: var(--font-size-xl);
		}
	}

	.feature-description {
		color: var(--text-secondary);
		font-size: var(--font-size-lg);
		line-height: var(--line-height-relaxed);
		margin: 0;
		
		@media (max-width: 768px) {
			font-size: var(--font-size-base);
		}
	}

	.features-list {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--spacing-md);
		width: 100%;
		margin-top: var(--spacing-md);
		
		@media (max-width: 768px) {
			grid-template-columns: 1fr;
			gap: var(--spacing-sm);
		}
	}

	.feature-item {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		padding: var(--spacing-sm) var(--spacing-md);
		background: rgba(96, 165, 250, 0.05);
		border: 1px solid rgba(96, 165, 250, 0.2);
		border-radius: var(--radius-sm);
		text-align: left;
		transition: all 0.3s ease;

		&:hover {
			background: rgba(96, 165, 250, 0.1);
			border-color: var(--primary-blue);
			transform: translateX(4px);
		}

		span {
			color: var(--text-secondary);
			font-size: var(--font-size-sm);
			line-height: 1.4;
		}
	}

	.check-icon {
		flex-shrink: 0;
		color: var(--primary-blue-bright);
	}

	// Responsive breakpoints
	@media (max-width: 374px) {
		.feature-content {
			display: none;
		}
		
		.gallery-showcase {
			grid-template-rows: 1fr;
		}
	}

	@media (min-width: 375px) and (max-width: 389px) {
		.feature-title {
			font-size: var(--font-size-lg);
		}

		.feature-description {
			font-size: var(--font-size-sm);
		}

		.features-list {
			gap: var(--spacing-xs);
		}
	}
</style>
