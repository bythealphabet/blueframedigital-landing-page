<script lang="ts">
	import { fly, fade, scale } from 'svelte/transition';
	import { quintOut, elasticOut } from 'svelte/easing';
	import { prefersReducedMotion } from 'svelte/motion';
	import { onMount } from 'svelte';

	interface Props {
		images: string[];
		text: string;
	}

	let { images, text }: Props = $props();

	// Use placeholder images if none provided
	const displayImages = $derived(
		images.length > 0
			? images
			: [
					'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800',
					'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
					'https://images.unsplash.com/photo-1503602642458-232111445657?w=800'
				]
	);

	let currentIndex = $state(0);
	let isAutoPlaying = $state(true);
	let containerElement: HTMLElement;

	const shouldAnimate = !prefersReducedMotion.current;

	onMount(() => {
		const interval = setInterval(() => {
			if (isAutoPlaying && displayImages.length > 1) {
				currentIndex = (currentIndex + 1) % displayImages.length;
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
		const totalCards = displayImages.length;
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
			{#each displayImages as image, i (i)}
				{@const cardClass = getCardClass(i)}
				<button
					class="card {cardClass}"
					onclick={() => selectSlide(i)}
					aria-label="View website {i + 1}"
					tabindex={cardClass === 'active' ? 0 : -1}
				>
					<img src={image} alt="Website example {i + 1}" loading="lazy" />
				</button>
			{/each}
		</div>

		{#if displayImages.length > 1}
			<div class="controls" transition:fade={{ delay: 400 }}>
				<div class="dots">
					{#each displayImages as _, i}
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

	{#if text}
		<div
			class="showcase-text"
			transition:fly={{ y: shouldAnimate ? 20 : 0, duration: 600, delay: 300, easing: quintOut }}
		>
			<p>{text}</p>
		</div>
	{/if}
</div>

<style lang="scss">
	.showcase {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-2xl);
		padding: var(--spacing-xl) 0;

		grid-column: 1 / -1;
		grid-row: 1 / -1;
	}

	.carousel-container {
		width: 100%;
		max-width: 1000px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-xl);
		transform-style: preserve-3d;
		perspective: 1200px;
	}

	.cards {
		position: relative;
		width: 100%;
		height: 500px;
		display: flex;
		align-items: center;
		justify-content: center;
		transform-style: preserve-3d;
		perspective: 1200px;

		@media (max-width: 768px) {
			height: 350px;
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

	.showcase-text {
		max-width: 800px;
		margin: 0 auto;
		text-align: center;
		padding: var(--spacing-xl);
		background: rgba(15, 23, 42, 0.4);
		border: 1px solid var(--primary-blue);
		border-radius: var(--radius-sm);
		backdrop-filter: blur(5px);
	}

	.showcase-text p {
		color: var(--text-secondary);
		font-size: var(--font-size-lg);
		line-height: var(--line-height-relaxed);
		margin: 0;
	}

	@media (max-width: 768px) {
		.showcase {
			padding: var(--spacing-lg) 0;
			gap: var(--spacing-lg);
		}

		.carousel-container {
			gap: var(--spacing-lg);
		}

		.showcase-text {
			padding: var(--spacing-lg);
		}

		.showcase-text p {
			font-size: var(--font-size-base);
		}
	}
</style>
