<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	interface JourneyStep {
		icon: string;
		title: string;
		description: string;
		timeframe: string;
	}

	interface Props {
		steps: JourneyStep[];
	}

	let { steps }: Props = $props();

	let currentStep = $state(0);
	let isAutoPlaying = $state(true);
	let animationInterval: ReturnType<typeof setInterval> | null = null;

	const dispatch = createEventDispatcher();

	function startAnimation() {
		if (animationInterval) return;

		animationInterval = setInterval(() => {
			if (!isAutoPlaying) return;

			currentStep = (currentStep + 1) % (steps.length + 1);

			// Pause at the end before restarting
			if (currentStep === steps.length) {
				setTimeout(() => {
					currentStep = 0;
				}, 2000);
			}
		}, 1500);
	}

	function stopAnimation() {
		if (animationInterval) {
			clearInterval(animationInterval);
			animationInterval = null;
		}
	}

	function handleUserInteraction() {
		isAutoPlaying = false;
		dispatch('userInteraction');
	}

	onMount(() => {
		// Wait a moment before starting animation
		setTimeout(() => {
			startAnimation();
		}, 500);

		// Initialize Lucide icons
		if (typeof window !== 'undefined' && (window as any).lucide) {
			(window as any).lucide.createIcons();
		}

		return () => {
			stopAnimation();
		};
	});

	// Recreate icons when currentStep changes
	$effect(() => {
		if (typeof window !== 'undefined' && (window as any).lucide) {
			setTimeout(() => {
				(window as any).lucide.createIcons();
			}, 0);
		}
	});
</script>

<div class="journey-flow-container" role="region" aria-label="Lead generation journey visualization">
	<div class="journey-header">
		<h3>How It Works: From Visitor to Client</h3>
		<p class="journey-subtitle">Watch leads flow through your system automatically</p>
	</div>

	<div
		class="journey-flow"
		onmouseenter={handleUserInteraction}
		ontouchstart={handleUserInteraction}
		role="presentation"
	>
		{#each steps as step, i (step.title)}
			<div class="journey-step" class:active={currentStep > i} class:current={currentStep === i + 1}>
				{#if currentStep > i}
					<div
						class="step-content"
						in:scale={{ duration: 500, delay: 0, easing: quintOut, start: 0.8 }}
					>
						<div class="step-icon-wrapper">
							<div class="step-icon">
								<i data-lucide={step.icon}></i>
							</div>
							<div class="step-number">{i + 1}</div>
						</div>

						<div class="step-details">
							<h4 class="step-title">{step.title}</h4>
							<p class="step-description">{step.description}</p>
							<span class="step-timeframe">{step.timeframe}</span>
						</div>
					</div>
				{:else}
					<div class="step-content inactive">
						<div class="step-icon-wrapper">
							<div class="step-icon">
								<i data-lucide={step.icon}></i>
							</div>
							<div class="step-number">{i + 1}</div>
						</div>

						<div class="step-details">
							<h4 class="step-title">{step.title}</h4>
							<p class="step-description">{step.description}</p>
							<span class="step-timeframe">{step.timeframe}</span>
						</div>
					</div>
				{/if}

				{#if i < steps.length - 1}
					<div class="journey-connector" class:active={currentStep > i + 1}>
						<div class="connector-line"></div>
						<div class="connector-arrow">
							<i data-lucide="chevron-right"></i>
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</div>

	{#if !isAutoPlaying}
		<div class="auto-play-paused" transition:fade={{ duration: 300 }}>
			<i data-lucide="pause"></i>
			<span>Animation paused</span>
		</div>
	{/if}
</div>

<style lang="scss">
	.journey-flow-container {
		width: 100%;
		padding: var(--spacing-2xl);
		background: var(--background-card);
		border: 2px solid var(--primary-blue);
		border-radius: var(--radius-sm);
		box-sizing: border-box;
		position: relative;
	}

	.journey-header {
		text-align: center;
		margin-bottom: var(--spacing-2xl);

		h3 {
			color: var(--primary-blue-bright);
			font-size: var(--font-size-h3);
			font-weight: 700;
			margin: 0 0 var(--spacing-sm) 0;
			text-shadow: 0 0 20px rgba(96, 165, 250, 0.3);
		}

		.journey-subtitle {
			color: var(--text-tertiary);
			font-size: var(--font-size-sm);
			margin: 0;
		}
	}

	.journey-flow {
		display: flex;
		flex-direction: row;
		align-items: stretch;
		gap: 0;
		width: 100%;
		box-sizing: border-box;
	}

	.journey-step {
		flex: 1;
		display: flex;
		flex-direction: row;
		align-items: center;
		position: relative;
		box-sizing: border-box;
	}

	.step-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-md);
		padding: var(--spacing-md);
		border-radius: var(--radius-sm);
		transition: all 0.3s ease;
		box-sizing: border-box;

		&.inactive {
			opacity: 0.3;
			filter: grayscale(100%);
		}

		&:not(.inactive) {
			background: rgba(96, 165, 250, 0.05);
		}
	}

	.step-icon-wrapper {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.step-icon {
		width: 64px;
		height: 64px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--primary-blue);
		border: 3px solid var(--primary-blue-bright);
		box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
		transition: all 0.3s ease;

		i {
			width: 32px;
			height: 32px;
			color: white;
		}

		.active &,
		.current & {
			background: var(--primary-blue-bright);
			box-shadow: 0 8px 24px rgba(96, 165, 250, 0.5);
			transform: scale(1.1);
		}
	}

	.step-number {
		position: absolute;
		bottom: -4px;
		right: -4px;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: var(--primary-blue-bright);
		color: white;
		font-size: var(--font-size-xs);
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px solid var(--background-card);
	}

	.step-details {
		text-align: center;
		width: 100%;
	}

	.step-title {
		color: var(--primary-blue-bright);
		font-size: var(--font-size-base);
		font-weight: 700;
		margin: 0 0 var(--spacing-xs) 0;
		line-height: 1.3;
	}

	.step-description {
		color: var(--text-secondary);
		font-size: var(--font-size-sm);
		line-height: 1.4;
		margin: 0 0 var(--spacing-xs) 0;
	}

	.step-timeframe {
		display: inline-block;
		padding: 2px 8px;
		background: rgba(96, 165, 250, 0.15);
		border-radius: var(--radius-sm);
		color: var(--primary-blue-bright);
		font-size: var(--font-size-xs);
		font-weight: 600;
	}

	.journey-connector {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 var(--spacing-sm);
		position: relative;
		flex-shrink: 0;
	}

	.connector-line {
		width: 40px;
		height: 2px;
		background: var(--primary-blue);
		opacity: 0.3;
		transition: all 0.5s ease;
	}

	.connector-arrow {
		position: absolute;
		color: var(--primary-blue);
		opacity: 0.3;
		transition: all 0.5s ease;

		i {
			width: 20px;
			height: 20px;
		}
	}

	.journey-connector.active {
		.connector-line {
			background: var(--primary-blue-bright);
			opacity: 1;
			box-shadow: 0 0 8px rgba(96, 165, 250, 0.5);
		}

		.connector-arrow {
			color: var(--primary-blue-bright);
			opacity: 1;
			animation: pulse 1.5s ease-in-out infinite;
		}
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.2);
		}
	}

	.auto-play-paused {
		position: absolute;
		top: var(--spacing-md);
		right: var(--spacing-md);
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		padding: var(--spacing-xs) var(--spacing-sm);
		background: rgba(0, 0, 0, 0.6);
		color: white;
		border-radius: var(--radius-sm);
		font-size: var(--font-size-xs);

		i {
			width: 14px;
			height: 14px;
		}
	}

	// Mobile: Vertical layout
	@media (max-width: 768px) {
		.journey-flow-container {
			padding: var(--spacing-lg);
		}

		.journey-header {
			margin-bottom: var(--spacing-lg);

			h3 {
				font-size: var(--font-size-lg);
			}

			.journey-subtitle {
				font-size: var(--font-size-xs);
			}
		}

		.journey-flow {
			flex-direction: column;
			gap: 0;
		}

		.journey-step {
			flex-direction: column;
			align-items: stretch;
		}

		.step-content {
			padding: var(--spacing-sm);
		}

		.step-icon {
			width: 48px;
			height: 48px;

			i {
				width: 24px;
				height: 24px;
			}
		}

		.step-number {
			width: 20px;
			height: 20px;
			font-size: 10px;
		}

		.step-title {
			font-size: var(--font-size-sm);
		}

		.step-description {
			font-size: var(--font-size-xs);
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}

		.step-timeframe {
			font-size: 10px;
			padding: 2px 6px;
		}

		.journey-connector {
			padding: var(--spacing-xs) 0;
			transform: rotate(90deg);
		}

		.connector-line {
			width: 30px;
		}

		.connector-arrow {
			i {
				width: 16px;
				height: 16px;
			}
		}
	}

	// Very small screens - Simplify further
	@media (max-width: 374px) {
		.journey-flow-container {
			padding: var(--spacing-md);
		}

		.journey-header {
			h3 {
				font-size: var(--font-size-base);
			}
		}

		.step-icon {
			width: 40px;
			height: 40px;

			i {
				width: 20px;
				height: 20px;
			}
		}

		.step-title {
			font-size: var(--font-size-xs);
		}

		.step-description {
			-webkit-line-clamp: 2;
		}
	}
</style>
