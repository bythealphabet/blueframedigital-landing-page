<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { prefersReducedMotion } from 'svelte/motion';
	import { onMount } from 'svelte';

	interface Props {
		images: string[];
		text: string;
	}

	let { images, text }: Props = $props();

	let currentIndex = $state(0);
	let isAutoPlaying = $state(true);

	const shouldAnimate = !prefersReducedMotion.current;

	onMount(() => {
		const interval = setInterval(() => {
			if (isAutoPlaying) {
				currentIndex = (currentIndex + 1) % images.length;
			}
		}, 4000);

		return () => clearInterval(interval);
	});

	function goToSlide(index: number) {
		currentIndex = index;
		isAutoPlaying = false;
	}

	function nextSlide() {
		currentIndex = (currentIndex + 1) % images.length;
		isAutoPlaying = false;
	}

	function prevSlide() {
		currentIndex = (currentIndex - 1 + images.length) % images.length;
		isAutoPlaying = false;
	}
</script>

<div
	class="showcase"
	transition:fly={{ y: shouldAnimate ? 40 : 0, duration: 600, easing: quintOut }}
>
	<div class="carousel">
		<button class="carousel-button prev" onclick={prevSlide} aria-label="Previous image">
			<i data-lucide="chevron-left"></i>
		</button>

		<div class="carousel-track">
			{#each images as image, i (i)}
				{#if i === currentIndex}
					<div class="carousel-slide" transition:fade={{ duration: 500 }}>
						<img src={image} alt="Website example {i + 1}" />
					</div>
				{/if}
			{/each}
		</div>
		<button class="carousel-button next" onclick={nextSlide} aria-label="Next image">
			<i data-lucide="chevron-right"></i>
		</button>

		<!-- <div class="carousel-dots">
			{#each images as _, i}
				<button
					class="dot"
					class:active={i === currentIndex}
					onclick={() => goToSlide(i)}
					aria-label="Go to slide {i + 1}"
				></button>
			{/each}
		</div> -->
	</div>

	<!-- <div
		class="showcase-text"
		transition:fly={{ y: shouldAnimate ? 20 : 0, duration: 600, delay: 300, easing: quintOut }}
	>
		<p>{text}</p>
	</div> -->
</div>

<style>
	.showcase {
		width: 100%;
	}

	.carousel {
		position: relative;
		width: 100%;
		max-width: 1200px;
		margin: 0 auto var(--spacing-2xl);
		border-radius: var(--radius-sm);
		overflow: hidden;
		border: 2px solid var(--primary-blue);
		background: var(--background-card);
		aspect-ratio: 16 / 9;
	}

	.carousel-track {
		width: 100%;
		height: 100%;
		position: relative;
	}

	.carousel-slide {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.carousel-slide img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.carousel-button {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		background: rgba(0, 0, 0, 0.5);
		border: none;
		color: white;
		padding: var(--spacing-md);
		cursor: pointer;
		z-index: 10;
		transition: background 0.3s ease;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.carousel-button:hover {
		background: rgba(37, 99, 235, 0.8);
	}

	.carousel-button.prev {
		left: var(--spacing-md);
	}

	.carousel-button.next {
		right: var(--spacing-md);
	}

	.carousel-button i {
		width: 24px;
		height: 24px;
	}

	.carousel-dots {
		position: absolute;
		bottom: var(--spacing-md);
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: var(--spacing-sm);
		z-index: 10;
	}

	.dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.5);
		border: none;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.dot.active {
		background: var(--primary-blue-bright);
		transform: scale(1.2);
	}

	.showcase-text {
		max-width: 900px;
		margin: 0 auto;
		text-align: center;
	}

	.showcase-text p {
		color: var(--text-secondary);
		font-size: var(--font-size-lg);
		line-height: var(--line-height-relaxed);
	}

	@media (max-width: 768px) {
		.carousel {
			aspect-ratio: 4 / 3;
		}

		.carousel-button {
			padding: var(--spacing-sm);
		}

		.carousel-button i {
			width: 20px;
			height: 20px;
		}

		.showcase-text p {
			font-size: var(--font-size-base);
		}
	}
</style>
