<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, fade, scale } from 'svelte/transition';
	import { quintOut, elasticOut } from 'svelte/easing';
	import { goto } from '$app/navigation';
	import { prefersReducedMotion as reducedMotionStore } from 'svelte/motion';
	import type { Service } from '$lib/data/services';
	import type { CardAnimationState } from '$lib/animations/animationCoordinator';

	interface Props {
		service: Service;
		isSelected?: boolean;
		cardState?: CardAnimationState | null;
		delay?: number;
		onclick?: () => void;
	}

	let { service, isSelected = false, cardState = null, delay = 0, onclick }: Props = $props();

	let visible = $state(false);
	let element: HTMLDivElement;
	let isHovered = $state(false);

	// Mouse tracking for 3D tilt effect
	let mouseX = $state(0);
	let mouseY = $state(0);
	let rotateX = $state(0);
	let rotateY = $state(0);

	// Respect reduced motion preference
	const shouldAnimate = $derived(!reducedMotionStore.current);

	// Derived states from cardState
	const isExiting = $derived(cardState?.phase === 'exiting');
	const exitDelay = $derived(cardState?.exitDelay || 0);

	onMount(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					visible = true;
				}
			},
			{
				threshold: 0.2,
				rootMargin: '0px 0px -50px 0px'
			}
		);

		observer.observe(element);

		return () => observer.disconnect();
	});

	function handleMouseMove(e: MouseEvent) {
		if (!element || !shouldAnimate || isSelected || isExiting) return;

		const rect = element.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const centerX = rect.width / 2;
		const centerY = rect.height / 2;

		rotateX = ((y - centerY) / centerY) * 10;
		rotateY = ((centerX - x) / centerX) * 10;

		mouseX = x;
		mouseY = y;
	}

	function handleMouseLeave() {
		isHovered = false;
		rotateX = 0;
		rotateY = 0;
	}

	function handleMouseEnter() {
		if (!isSelected && !isExiting) {
			isHovered = true;
		}
	}

	function handleClick() {
		if (onclick) {
			onclick();
		} else if (service.slug && !isSelected) {
			goto(`/services/${service.slug}`);
		}
	}

	// 3D depth exit animation
	function exitAnimation(node: HTMLElement, { delay }: { delay: number }) {
		return {
			delay,
			duration: 400,
			css: (t: number) => {
				const eased = quintOut(t);
				return `
					opacity: ${eased};
					transform: 
						perspective(1000px) 
						scale(${1 - 0.5 * (1 - eased)})
						translateZ(${-500 * (1 - eased)}px)
						rotateX(${-15 * (1 - eased)}deg);
				`;
			}
		};
	}
</script>

<div
	bind:this={element}
	class="service-card-container"
	style="--delay: {delay}ms"
	role="article"
>
	{#if visible && !isExiting}
		<button
			class="service-card"
			class:hovered={isHovered}
			class:selected={isSelected}
			class:clickable={!!service.slug || !!onclick}
			onmousemove={handleMouseMove}
			onmouseleave={handleMouseLeave}
			onmouseenter={handleMouseEnter}
			onclick={handleClick}
			in:fly={{ y: shouldAnimate ? 60 : 0, duration: 800, delay, easing: quintOut }}
			style="transform: perspective(1000px) rotateX({rotateX}deg) rotateY({rotateY}deg)"
			tabindex={service.slug || onclick ? 0 : -1}
			aria-label={isSelected
				? `${service.title} selected. Click to return to all services.`
				: `View details about ${service.title}`}
			aria-pressed={isSelected}
		>
			<div class="service-icon" class:pulse={isHovered && !isSelected}>
				<i data-lucide={service.icon}></i>
			</div>

			<h3 transition:fade={{ duration: 600, delay: delay + 200 }}>
				{service.title}
			</h3>

			<p transition:fade={{ duration: 600, delay: delay + 400 }}>
				{service.description}
			</p>

			{#if isSelected}
				<div class="selected-indicator" transition:scale={{ duration: 300, easing: elasticOut }}>
					<i data-lucide="check-circle"></i>
				</div>
			{/if}

			{#if isHovered && shouldAnimate && !isSelected}
				<div
					class="spotlight"
					transition:scale={{ duration: 300, easing: elasticOut }}
					style="left: {mouseX}px; top: {mouseY}px"
				></div>
			{/if}
		</button>
	{:else if isExiting}
		<div class="service-card exiting" out:exitAnimation={{ delay: exitDelay }}>
			<div class="service-icon">
				<i data-lucide={service.icon}></i>
			</div>

			<h3>{service.title}</h3>

			<p>{service.description}</p>
		</div>
	{/if}
</div>

<style>
	.service-card-container {
		perspective: 1000px;
		position: relative;
		height: 100%;
	}

	.service-card {
		background: var(--background-card);
		padding: var(--spacing-xl);
		border: 2px solid var(--primary-blue);
		border-radius: var(--radius-sm);
		position: relative;
		overflow: hidden;
		transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
		transform-style: preserve-3d;
		will-change: transform, opacity;
		height: 100%;
		width: 100%;
		text-align: left;
		font-family: inherit;
		font-size: inherit;
		color: inherit;
	}

	.service-card.clickable {
		cursor: pointer;
	}

	.service-card.selected {
		cursor: pointer;
		border-color: var(--primary-blue-bright);
		box-shadow: 0 0 40px rgba(96, 165, 250, 0.5);
		background: linear-gradient(
			135deg,
			var(--background-card) 0%,
			rgba(37, 99, 235, 0.05) 100%
		);
		transform-style: preserve-3d;
		backface-visibility: hidden;
		/* Maintain exact original dimensions */
		max-height: 100%;
		overflow: hidden;
	}

	.service-card.exiting {
		pointer-events: none;
		user-select: none;
	}

	.service-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: repeating-linear-gradient(
			45deg,
			transparent,
			transparent 10px,
			rgba(30, 58, 138, 0.03) 10px,
			rgba(30, 58, 138, 0.03) 20px
		);
		pointer-events: none;
		opacity: 1;
		transition: opacity 0.3s ease;
	}

	.service-card.hovered::before,
	.service-card.selected::before {
		opacity: 0;
	}

	.service-card.hovered:not(.selected) {
		border-color: var(--primary-blue-light);
		box-shadow: 0 20px 60px rgba(37, 99, 235, 0.4);
		transform: translateZ(20px);
	}

	.service-icon {
		margin-bottom: var(--spacing-md);
		color: var(--primary-blue-bright);
		transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
		transform-style: preserve-3d;
		transform: translateZ(0);
	}

	.service-icon.pulse {
		/* animation: pulse 0.6s ease-in-out; */
		color: var(--primary-blue-light);
		filter: drop-shadow(0 0 20px var(--primary-blue-bright));
	}

	@keyframes pulse {
		0%,
		100% {
			transform: translateZ(0) scale(1);
		}
		50% {
			transform: translateZ(30px) scale(1.2);
		}
	}

	h3 {
		font-size: var(--font-size-h3);
		margin-bottom: var(--spacing-md);
		color: var(--text-secondary);
		transform: translateZ(10px);
	}

	p {
		color: var(--text-tertiary);
		line-height: var(--line-height-relaxed);
		transform: translateZ(5px);
	}

	.selected-indicator {
		position: absolute;
		top: var(--spacing-sm);
		right: var(--spacing-sm);
		color: var(--primary-blue-bright);
		filter: drop-shadow(0 0 10px rgba(96, 165, 250, 0.8));
	}

	.selected-indicator i {
		width: 24px;
		height: 24px;
	}

	.spotlight {
		position: absolute;
		width: 200px;
		height: 200px;
		background: radial-gradient(circle, rgba(96, 165, 250, 0.2) 0%, transparent 70%);
		transform: translate(-50%, -50%);
		pointer-events: none;
		z-index: 0;
	}

	/* Shimmer effect */
	.service-card::after {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: linear-gradient(90deg, transparent, rgba(96, 165, 250, 0.1), transparent);
		transform: translateX(-100%);
		transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.service-card.hovered:not(.selected)::after {
		transform: translateX(100%);
	}

	/* Performance optimizations */
	.service-card {
		transform: translateZ(0);
		backface-visibility: hidden;
	}

	@media (max-width: 768px) {
		.service-card {
			transition-duration: 0.6s;
		}

		.service-card.hovered:not(.selected) {
			transform: translateY(-8px);
		}

		/* Disable 3D effects on mobile */
		.service-icon.pulse {
			animation: none;
			filter: none;
		}

		.spotlight {
			display: none;
		}

		.service-card.selected {
			/* Compact mode for mobile */
			padding: var(--spacing-md);
		}

		.service-card.selected h3 {
			font-size: var(--font-size-base);
			margin-bottom: var(--spacing-xs);
		}

		.service-card.selected p {
			font-size: var(--font-size-sm);
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}
	}
</style>
