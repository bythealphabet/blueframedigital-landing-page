<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';

	interface Props {
		before: string;
		after: string;
		label?: string;
	}

	let { before, after, label = 'Renovation Transformation' }: Props = $props();

	let sliderValue = $state(50);
	let containerElement: HTMLDivElement;
	let isDragging = $state(false);

	const dispatch = createEventDispatcher();

	function notifyInteraction() {
		dispatch('userInteraction');
	}

	function handleSliderChange(e: Event) {
		const target = e.target as HTMLInputElement;
		sliderValue = parseInt(target.value);
		notifyInteraction();
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isDragging || !containerElement) return;

		const rect = containerElement.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
		sliderValue = percentage;
		notifyInteraction();
	}

	function handleTouchMove(e: TouchEvent) {
		if (!containerElement) return;

		const touch = e.touches[0];
		const rect = containerElement.getBoundingClientRect();
		const x = touch.clientX - rect.left;
		const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
		sliderValue = percentage;
		notifyInteraction();
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			sliderValue = Math.max(0, sliderValue - 1);
			notifyInteraction();
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			sliderValue = Math.min(100, sliderValue + 1);
			notifyInteraction();
		}
	}

	function handleMouseDown() {
		isDragging = true;
		notifyInteraction();
	}

	function handleTouchStart() {
		isDragging = true;
		notifyInteraction();
	}

	onMount(() => {
		if (typeof window !== 'undefined' && (window as any).lucide) {
			(window as any).lucide.createIcons();
		}
	});
</script>

<div class="before-after-container">
	{#if label}
		<!-- <div class="ba-label">
			<h4>{label}</h4>
		</div> -->
	{/if}

	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		class="ba-slider-wrapper"
		bind:this={containerElement}
		role="application"
		aria-label="Before and after comparison slider"
		tabindex="0"
		onmousemove={handleMouseMove}
		onmouseup={() => (isDragging = false)}
		onmouseleave={() => (isDragging = false)}
		ontouchmove={handleTouchMove}
		ontouchend={() => (isDragging = false)}
		onkeydown={handleKeyDown}
	>
		<!-- After Image (bottom layer) -->
		<div class="ba-image ba-after">
			<img src={after} alt="After renovation" />
			<div class="ba-badge after-badge">After</div>
		</div>

		<!-- Before Image (top layer with clip) -->
		<div class="ba-image ba-before" style="clip-path: inset(0 {100 - sliderValue}% 0 0);">
			<img src={before} alt="Before renovation" />
			<div class="ba-badge before-badge">Before</div>
		</div>

		<!-- Slider Handle -->
		<div
			class="ba-handle"
			style="left: {sliderValue}%;"
			onmousedown={handleMouseDown}
			ontouchstart={handleTouchStart}
			role="slider"
			aria-valuenow={sliderValue}
			aria-valuemin="0"
			aria-valuemax="100"
			tabindex="0"
		>
			<div class="ba-handle-line"></div>
			<div class="ba-handle-circle">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polyline points="15 18 9 12 15 6"></polyline>
				</svg>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polyline points="9 18 15 12 9 6"></polyline>
				</svg>
			</div>
		</div>

		<!-- Hidden range input for accessibility -->
		<input
			type="range"
			min="0"
			max="100"
			value={sliderValue}
			oninput={handleSliderChange}
			class="ba-range-input"
			aria-label="Adjust before and after comparison"
		/>
	</div>
</div>

<style lang="scss">
	.before-after-container {
		width: 100%;
		max-width: 100%;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		box-sizing: border-box;
	}

	.ba-label {
		text-align: center;

		h4 {
			color: var(--primary-blue-bright);
			font-size: var(--font-size-xl);
			font-weight: 700;
			margin: 0;
			text-shadow: 0 0 20px rgba(96, 165, 250, 0.3);
		}
	}

	.ba-slider-wrapper {
		position: relative;
		width: 100%;
		max-width: 100%;
		aspect-ratio: 16 / 10;
		overflow: hidden;
		border-radius: var(--radius-sm);
		border: 2px solid var(--primary-blue-bright);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
		cursor: ew-resize;
		user-select: none;
		box-sizing: border-box;

		@media (max-width: 768px) {
			aspect-ratio: 4 / 3;
		}
	}

	.ba-image {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
        display: flex;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			display: block;
			pointer-events: none;
		}
	}

	.ba-before {
		z-index: 2;
	}

	.ba-after {
		z-index: 1;
	}

	.ba-badge {
		position: absolute;
		top: var(--spacing-md);
		padding: var(--spacing-sm) var(--spacing-md);
		border-radius: var(--radius-sm);
		font-weight: 700;
		font-size: var(--font-size-sm);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		z-index: 3;
		backdrop-filter: blur(10px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.before-badge {
		left: var(--spacing-md);
		background: rgba(220, 38, 38, 0.9);
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.3);
	}

	.after-badge {
		right: var(--spacing-md);
		background: rgba(34, 197, 94, 0.9);
		color: white;
		border: 1px solid rgba(255, 255, 255, 0.3);
	}

	.ba-handle {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 2px;
		transform: translateX(-50%);
		z-index: 10;
		cursor: ew-resize;
		touch-action: none;
	}

	.ba-handle-line {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 50%;
		width: 4px;
		background: white;
		transform: translateX(-50%);
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
	}

	.ba-handle-circle {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 48px;
		height: 48px;
		background: white;
		border: 3px solid var(--primary-blue-bright);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 2px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		transition: all 0.3s ease;

		svg {
			width: 16px;
			height: 16px;
			color: var(--primary-blue-bright);
		}

		&:hover {
			transform: translate(-50%, -50%) scale(1.1);
			box-shadow: 0 6px 20px rgba(96, 165, 250, 0.5);
		}

		@media (max-width: 768px) {
			width: 32px; // Reduced from 40px
			height: 32px; // Reduced from 40px

			svg {
				width: 12px; // Reduced from 14px
				height: 12px; // Reduced from 14px
			}
		}
	}

	.ba-range-input {
		position: absolute;
		bottom: var(--spacing-md);
		left: 50%;
		transform: translateX(-50%);
		width: 80%;
		height: 6px;
		opacity: 0.9;
		cursor: pointer;
		z-index: 9;
		appearance: none;
		background: rgba(255, 255, 255, 0.3);
		border-radius: 3px;
		outline: none;

		&::-webkit-slider-thumb {
			appearance: none;
			width: 24px;
			height: 24px;
			background: var(--primary-blue-bright);
			border-radius: 50%;
			cursor: pointer;
			border: 2px solid white;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
		}

		&::-moz-range-thumb {
			width: 24px;
			height: 24px;
			background: var(--primary-blue-bright);
			border-radius: 50%;
			cursor: pointer;
			border: 2px solid white;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
		}

		&:hover {
			opacity: 1;
		}

		@media (max-width: 768px) {
			opacity: 1;
			height: 8px;
			bottom: var(--spacing-sm);

			&::-webkit-slider-thumb {
				width: 28px;
				height: 28px;
			}

			&::-moz-range-thumb {
				width: 28px;
				height: 28px;
			}
		}
	}

	// Responsive slider sizing - Progressive enhancement for different viewports

	// Very small screens - Constrain height more aggressively
	@media (max-width: 374px) {
		.ba-slider-wrapper {
			aspect-ratio: 4 / 3; // Taller ratio for small screens
			max-height: 50vh; // Increased for more space
			min-height: 220px; // Increased
		}

		.ba-label h4 {
			font-size: var(--font-size-sm);
		}

		.ba-badge {
			font-size: 10px;
			padding: 4px 8px;
		}
	}

	// Small to medium screens - Moderate height constraint
	@media (min-width: 375px) and (max-width: 768px) {
		.ba-slider-wrapper {
			max-height: 55vh; // Increased for more space
			min-height: 280px; // Increased
		}

		.ba-label h4 {
			font-size: var(--font-size-base);
		}

		.ba-badge {
			font-size: 11px;
			padding: 4px 10px;
		}
	}

	// Desktop - More space available
	@media (min-width: 769px) {
		.ba-slider-wrapper {
			max-height: 60vh; // Increased for more space
			min-height: 400px; // Increased
		}

		.ba-badge {
			font-size: var(--font-size-sm);
			padding: 6px 10px; // Smaller padding
		}
	}
</style>
