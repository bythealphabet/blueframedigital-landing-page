<script lang="ts">
	import { fly, fade, scale } from 'svelte/transition';
	import { quintOut, elasticOut } from 'svelte/easing';
	import { prefersReducedMotion } from 'svelte/motion';
	import { onMount } from 'svelte';

	interface WebsiteItem {
		image: string;
		description: string;
		url: string;
	}

	interface Props {
		websites?: WebsiteItem[];
		// Backward compatibility props
		images?: string[];
		text?: string;
	}

	let { websites = [], images = [], text = '' }: Props = $props();

	// Default placeholder data with descriptions and URLs
	// State variables
	let currentIndex = $state(0);
	let isAutoPlaying = $state(true);
	let containerElement: HTMLElement;

	// Default placeholder data with descriptions and URLs
	const defaultWebsites: WebsiteItem[] = [
		{
			image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800',
			description: 'High performance, fast loading websites built for speed and user experience',
			url: '#'
		},
		{
			image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
			description: 'Modern design with the latest technology and best practices',
			url: '#'
		},
		{
			image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=800',
			description: 'Custom website design that fits your style and branding perfectly',
			url: '#'
		},
		{
			image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800',
			description: 'Engaging websites that keep users interested and drive conversions',
			url: '#'
		}
	];

	// Individual descriptions for backward compatibility
	const defaultDescriptions = [
		'High performance, fast loading websites built for speed and user experience',
		'Modern design with the latest technology and best practices',
		'Custom website design that fits your style and branding perfectly',
		'Engaging websites that keep users interested and drive conversions'
	];

	// Handle both new format (websites array) and old format (images + text)
	const displayWebsites = $derived.by(() => {
		if (websites.length > 0) {
			return websites;
		}
		
		// Backward compatibility: convert old format to new format
		if (images.length > 0) {
			return images.map((img, idx) => ({
				image: img,
				description: defaultDescriptions[idx % defaultDescriptions.length],
				url: '#'
			}));
		}
		
		return defaultWebsites;
	});

	const currentWebsite = $derived(displayWebsites[currentIndex]);

	const shouldAnimate = !prefersReducedMotion.current;

	onMount(() => {
		const interval = setInterval(() => {
			if (isAutoPlaying && displayWebsites.length > 1) {
				currentIndex = (currentIndex + 1) % displayWebsites.length;
			}
		}, 5000);

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
		const totalCards = displayWebsites.length;
		if (index === currentIndex) return 'active';

		// Calculate relative position
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
	class="showcase"
	bind:this={containerElement}
	transition:fly={{ y: shouldAnimate ? 40 : 0, duration: 600, easing: quintOut }}
>
	<div class="carousel-container">
		<div class="cards">
			{#each displayWebsites as website, i (i)}
				{@const cardClass = getCardClass(i)}
				<button
					class="card {cardClass}"
					onclick={() => selectSlide(i)}
					aria-label="View website {i + 1}"
					tabindex={cardClass === 'active' ? 0 : -1}
				>
					<img src={website.image} alt="Website example {i + 1}" loading="lazy" />
				</button>
			{/each}
		</div>

		{#if displayWebsites.length > 1}
			<div class="controls" transition:fade={{ delay: 400 }}>
				<div class="dots">
					{#each displayWebsites as _, i}
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
			class="showcase-content"
			transition:fly={{ y: shouldAnimate ? 20 : 0, duration: 600, delay: 150, easing: quintOut }}
		>
			<p class="description">{currentWebsite.description}</p>
			{#if currentWebsite.url && currentWebsite.url !== '#'}
				<a
					href={currentWebsite.url}
					target="_blank"
					rel="noopener noreferrer"
					class="cta-button"
				>
					<span>View Live Website</span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
						<polyline points="15 3 21 3 21 9"></polyline>
						<line x1="10" y1="14" x2="21" y2="3"></line>
					</svg>
				</a>
			{/if}
		</div>
	{/key}
</div>

<style lang="scss">
	.showcase {
		width: 100%;
		display: grid;
		grid-template-columns: subgrid;
		grid-template-rows: 1fr auto;
		gap: var(--spacing-lg);
		padding: var(--spacing-lg);

		grid-column: 1 / -1;
		grid-row: 1 / -1;
		
		@media (max-width: 768px) {
			grid-template-rows: minmax(280px, 1fr) auto;
			padding: var(--spacing-md);
			gap: var(--spacing-md);
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
		min-height: 0; /* Allow shrinking */
		z-index: 2; /* Above the selected card */
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
		will-change: transform, opacity, z-index;
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

		// Active (center) card
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

		// Next (right) card
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

		// Previous (left) card
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

		// Hidden cards
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

	.showcase-content {
		grid-column: 1 / -1;
		grid-row: 2;
		
		max-width: 800px;
		width: 100%;
		justify-self: center;
		text-align: center;
		padding: var(--spacing-lg);
		background: rgba(15, 23, 42, 0.6);
		border: 1px solid var(--primary-blue);
		border-radius: var(--radius-sm);
		backdrop-filter: blur(10px);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-md);
		
		@media (max-width: 768px) {
			padding: var(--spacing-md);
		}
	}

	.description {
		color: var(--text-secondary);
		font-size: var(--font-size-lg);
		line-height: var(--line-height-relaxed);
		margin: 0;
	}

	.cta-button {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-sm);
		padding: var(--spacing-md) var(--spacing-xl);
		background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%);
		color: white;
		text-decoration: none;
		border-radius: var(--radius-sm);
		font-weight: 600;
		font-size: var(--font-size-base);
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
		border: 1px solid var(--primary-blue-bright);
		box-shadow: 0 4px 20px rgba(96, 165, 250, 0.3);

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 8px 30px rgba(96, 165, 250, 0.5);
			background: linear-gradient(135deg, var(--primary-blue-bright) 0%, var(--primary-blue) 100%);
		}

		&:active {
			transform: translateY(0);
		}

		&:focus {
			outline: 2px solid var(--primary-blue-bright);
			outline-offset: 3px;
		}

		svg {
			transition: transform 0.3s ease;
		}

		&:hover svg {
			transform: translate(2px, -2px);
		}
	}

	// Responsive breakpoints
	// Hide content on very small screens (< 375px - smaller than iPhone SE)
	@media (max-width: 374px) {
		.showcase-content {
			display: none;
		}
		
		.showcase {
			grid-template-rows: 1fr;
		}
	}

	// Show content but adjust on small screens (375px - 389px, iPhone SE)
	@media (min-width: 375px) and (max-width: 389px) {
		.description {
			font-size: var(--font-size-sm);
			line-height: 1.5;
		}

		.cta-button {
			padding: var(--spacing-sm) var(--spacing-md);
			font-size: var(--font-size-sm);
		}
	}

	// iPhone 12 and similar (390px+) up to tablet
	@media (min-width: 390px) and (max-width: 768px) {
		.description {
			font-size: var(--font-size-base);
		}

		.cta-button {
			padding: var(--spacing-sm) var(--spacing-lg);
		}
	}
</style>
