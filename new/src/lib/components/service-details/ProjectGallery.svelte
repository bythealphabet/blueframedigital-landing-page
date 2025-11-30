<script lang="ts">
	import { fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { prefersReducedMotion } from 'svelte/motion';

	interface Props {
		images: string[];
		text: string;
	}

	let { images, text }: Props = $props();

	let selectedImage = $state<string | null>(null);
	const shouldAnimate = !prefersReducedMotion.current;

	function openLightbox(image: string) {
		selectedImage = image;
	}

	function closeLightbox() {
		selectedImage = null;
	}
</script>

<div class="gallery-container" transition:fly={{ y: shouldAnimate ? 40 : 0, duration: 600, easing: quintOut }}>
	<div class="gallery-text">
		<p>{text}</p>
	</div>

	<div class="gallery-grid">
		{#each images as image, i (i)}
			<button
				class="gallery-item"
				onclick={() => openLightbox(image)}
				transition:scale={{ duration: 400, delay: i * 50, easing: quintOut }}
			>
				<img src={image} alt="Project {i + 1}" />
				<div class="gallery-overlay">
					<i data-lucide="maximize-2"></i>
				</div>
			</button>
		{/each}
	</div>
</div>

{#if selectedImage}
	<div class="lightbox" onclick={closeLightbox} transition:fade={{ duration: 300 }}>
		<button class="lightbox-close" onclick={closeLightbox} aria-label="Close lightbox">
			<i data-lucide="x"></i>
		</button>
		<div class="lightbox-content" transition:scale={{ duration: 400, easing: quintOut }}>
			<img src={selectedImage} alt="Selected project" />
		</div>
	</div>
{/if}

<style>
	.gallery-container {
		width: 100%;
	}

	.gallery-text {
		max-width: 900px;
		margin: 0 auto var(--spacing-2xl);
		text-align: center;
	}

	.gallery-text p {
		color: var(--text-secondary);
		font-size: var(--font-size-lg);
		line-height: var(--line-height-relaxed);
	}

	.gallery-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: var(--spacing-lg);
		max-width: 1400px;
		margin: 0 auto;
	}

	.gallery-item {
		position: relative;
		aspect-ratio: 4 / 3;
		border-radius: var(--radius-sm);
		overflow: hidden;
		border: 2px solid var(--primary-blue);
		background: var(--background-card);
		cursor: pointer;
		transition: transform 0.3s ease;
		padding: 0;
	}

	.gallery-item:hover {
		transform: scale(1.05);
	}

	.gallery-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.gallery-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.gallery-item:hover .gallery-overlay {
		opacity: 1;
	}

	.gallery-overlay i {
		width: 48px;
		height: 48px;
		color: white;
	}

	.lightbox {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.9);
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--spacing-xl);
	}

	.lightbox-close {
		position: absolute;
		top: var(--spacing-lg);
		right: var(--spacing-lg);
		background: rgba(255, 255, 255, 0.1);
		border: 2px solid white;
		color: white;
		padding: var(--spacing-sm);
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1001;
		transition: all 0.3s ease;
	}

	.lightbox-close:hover {
		background: var(--primary-blue);
	}

	.lightbox-close i {
		width: 24px;
		height: 24px;
	}

	.lightbox-content {
		max-width: 90%;
		max-height: 90%;
	}

	.lightbox-content img {
		max-width: 100%;
		max-height: 90vh;
		object-fit: contain;
		border-radius: var(--radius-sm);
	}

	@media (max-width: 768px) {
		.gallery-grid {
			grid-template-columns: 1fr;
			gap: var(--spacing-md);
		}

		.gallery-text p {
			font-size: var(--font-size-base);
		}

		.lightbox {
			padding: var(--spacing-md);
		}
	}
</style>

