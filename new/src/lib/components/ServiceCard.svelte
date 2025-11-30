<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { goto } from '$app/navigation';
	import { prefersReducedMotion as reducedMotionStore } from 'svelte/motion';
	import type { Service } from '$lib/data/services';
	import type { CardAnimationState } from '$lib/animations/animationCoordinator';

	interface Props {
		service: Service;
		isSelected?: boolean;
		isHomePage?: boolean;
		cardState?: CardAnimationState | null;
		cardIndex?: number;
		delay?: number;
		onclick?: () => void;
	}

	let {
		service,
		isSelected = false,
		isHomePage = true,
		cardState = null,
		cardIndex = 0,
		delay = 0,
		onclick
	}: Props = $props();

	let visible = $state(false);
	let element: HTMLDivElement;
	let isHovered = $state(false);
	let isTouchDevice = $state(false);

	// Mouse tracking for 3D tilt effect
	let mouseX = $state(0);
	let mouseY = $state(0);
	let rotateX = $state(0);
	let rotateY = $state(0);

	// Respect reduced motion preference
	const shouldAnimate = $derived(!reducedMotionStore.current);
	
	// Disable tilt effect on touch devices
	const shouldEnableTilt = $derived(!isTouchDevice && shouldAnimate);

	// Derived states from cardState
	const isExiting = $derived(cardState?.phase === 'exiting');
	const exitDelay = $derived(cardState?.exitDelay || 0);

	onMount(() => {
		// Detect touch device
		isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

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
		if (!element || !shouldEnableTilt || isSelected || isExiting) return;

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

	// Custom entrance animation based on card position and page context
	function entranceAnimation(
		node: HTMLElement,
		{ delay, index, homepage }: { delay: number; index: number; homepage: boolean }
	) {
		if (!shouldAnimate) {
			return { duration: 0 };
		}

		const duration = homepage ? 1000 : 600;

		return {
			delay,
			duration,
			css: (t: number) => {
				const eased = quintOut(t);
				const opacity = eased;

				// Service page: Simple, uniform fade + slide up + scale
				if (!homepage) {
					const y = 40 * (1 - eased);
					const scale = 0.95 + 0.05 * eased;
					return `
						opacity: ${opacity};
						transform:
							perspective(1000px)
							translateY(${y}px)
							scale(${scale});
					`;
				}

				// Home page: Dynamic arc animations based on position
				// Center card (index 1): Straight up from bottom
				if (index === 1) {
					const y = 150 * (1 - eased);
					return `
						opacity: ${opacity};
						transform:
							perspective(1000px)
							translateY(${y}px)
							scale(${0.8 + 0.2 * eased});
					`;
				}

				// Left card (index 0): Arc from left
				if (index === 0) {
					const x = -200 * (1 - eased);
					const y = 100 * Math.sin(Math.PI * (1 - eased));
					const rotate = -30 * (1 - eased);
					return `
						opacity: ${opacity};
						transform:
							perspective(1000px)
							translateX(${x}px)
							translateY(${y}px)
							rotateZ(${rotate}deg)
							scale(${0.7 + 0.3 * eased});
					`;
				}

				// Right card (index 2): Arc from right
				if (index === 2) {
					const x = 200 * (1 - eased);
					const y = 100 * Math.sin(Math.PI * (1 - eased));
					const rotate = 30 * (1 - eased);
					return `
						opacity: ${opacity};
						transform:
							perspective(1000px)
							translateX(${x}px)
							translateY(${y}px)
							rotateZ(${rotate}deg)
							scale(${0.7 + 0.3 * eased});
					`;
				}

				// Default fallback
				return `
					opacity: ${opacity};
					transform: perspective(1000px) translateY(${60 * (1 - eased)}px);
				`;
			}
		};
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
	class:container-selected={isSelected}
	style="--delay: {delay}ms"
	role="article"
>
	{#if visible}
		<button
			class="service-card"
			class:hovered={isHovered}
			class:selected={isSelected}
			class:clickable={!!service.slug || !!onclick}
			onmousemove={handleMouseMove}
			onmouseleave={handleMouseLeave}
			onmouseenter={handleMouseEnter}
			onclick={handleClick}
			in:entranceAnimation={{ delay, index: cardIndex, homepage: isHomePage }}
			style="transform: perspective(1000px) {shouldEnableTilt ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg)` : ''}"
			tabindex={service.slug || onclick ? 0 : -1}
			aria-label={isSelected
				? `${service.title} selected. Click to return to all services.`
				: `View details about ${service.title}`}
			aria-pressed={isSelected}
		>
			<h3 transition:fade={{ duration: 600, delay: delay + 200 }}>
				{service.title}
			</h3>

			<p transition:fade={{ duration: 600, delay: delay + 400 }}>
				{service.description}
			</p>

			{#if isHovered && shouldEnableTilt && !isSelected}
				<span
					class="spotlight"
					transition:scale={{ duration: 300, easing: quintOut }}
					style="left: {mouseX}px; top: {mouseY}px"
				></span>
			{/if}
		</button>
	{/if}
</div>

<style lang="scss">
	.service-card-container {
		perspective: 1000px;
		position: relative;
		height: 100%;
		width: 100%;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
	}

	.service-card {
		background: var(--background-card);
		padding: var(--spacing-xl);
		border: 2px solid var(--primary-blue);
		border-radius: var(--radius-sm);
		position: relative;
		overflow: hidden;
		/* Animate visual properties, not size */
		transition:
			border-color 800ms cubic-bezier(0.16, 1, 0.3, 1),
			box-shadow 800ms cubic-bezier(0.16, 1, 0.3, 1),
			background 800ms cubic-bezier(0.16, 1, 0.3, 1),
			gap 800ms cubic-bezier(0.16, 1, 0.3, 1);
		transform-style: preserve-3d;
		will-change: transform, opacity;
		height: 100%;
		width: 100%;
		text-align: left;
		font-family: inherit;
		font-size: inherit;
		color: inherit;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		grid-column: 1;
		grid-row: 1;
		/* Performance optimizations */
		transform: translateZ(0);
		backface-visibility: hidden;

		&.clickable {
			cursor: pointer;
		}

		&.selected {
			cursor: pointer;
			border-color: var(--primary-blue-bright);
			box-shadow: 0 0 40px rgba(96, 165, 250, 0.5);
			background: linear-gradient(135deg, var(--background-card) 0%, rgba(37, 99, 235, 0.05) 100%);
			transform-style: preserve-3d;
			backface-visibility: hidden;
			overflow: hidden;
			grid-row: 1;
			align-items: center;
			justify-content: center;
			/* Compact mode when selected - use gap instead of padding */
			padding: var(--spacing-md);
			gap: var(--spacing-sm);

			h3 {
				/*font-size: var(--font-size-base);*/
				margin: 0;
			}

			p {
				max-height: 0;
				opacity: 0;
				margin: 0;
				padding: 0;
				overflow: hidden;
			}

			&::before {
				opacity: 0;
			}
		}

		/*.service-card.exiting {
			pointer-events: none;
			user-select: none;
			grid-column: 1 / -1;
			grid-row: 1 / -1;
		}*/

		&::before {
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

		/* Shimmer effect */
		&::after {
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

		&.hovered:not(.selected) {
			border-color: var(--primary-blue-light);
			box-shadow: 0 20px 60px rgba(37, 99, 235, 0.4);
			transform: translateZ(20px);

			&::before {
				opacity: 0;
			}

			&::after {
				transform: translateX(100%);
			}

			@media (max-width: 768px) {
				transform: translateY(-8px);
			}
		}

		h3 {
			/* Fixed font size to ensure consistent card heights */
			font-size: 2.4rem;
			margin-bottom: var(--spacing-md);
			color: var(--text-secondary);
			transform: translateZ(10px);
			transition:
				font-size 800ms cubic-bezier(0.16, 1, 0.3, 1),
				margin-bottom 800ms cubic-bezier(0.16, 1, 0.3, 1);
		}

		p {
			color: var(--text-tertiary);
			line-height: var(--line-height-relaxed);
			transform: translateZ(5px);
			transition:
				max-height 800ms cubic-bezier(0.16, 1, 0.3, 1),
				opacity 800ms cubic-bezier(0.16, 1, 0.3, 1),
				margin 800ms cubic-bezier(0.16, 1, 0.3, 1);
			max-height: 500px;
			opacity: 1;
		}
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
</style>
