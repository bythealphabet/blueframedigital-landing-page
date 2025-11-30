<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, fade, crossfade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { prefersReducedMotion as reducedMotionStore } from 'svelte/motion';
	import ServiceCard from '$lib/components/ServiceCard.svelte';
	import { servicesVisibility } from '$lib/stores/scrollStore';
	import { services, getServiceBySlug } from '$lib/data/services';
	import { animationCoordinator } from '$lib/animations/animationCoordinator';
	import DetailContentGrid from './service-details/DetailContentGrid.svelte';

	// Accept optional selectedSlug prop from parent (e.g., from URL routing)
	let { selectedSlug: initialSlug = null }: { selectedSlug?: string | null } = $props();

	// Local state for selection - initialized from prop if provided
	let selectedSlug = $state<string | null>(initialSlug);

	let servicesVisible = $state(false);
	let sectionRef: HTMLElement;
	let isMobile = $state(false);

	// Setup crossfade with 3D transforms for card transitions
	const [send, receive] = crossfade({
		duration: 800,
		easing: quintOut,
		fallback() {
			return {
				duration: 300,
				easing: quintOut,
				css: (t) => `
					opacity: ${t};
					transform: perspective(1000px) translateZ(${-200 * (1 - t)}px) scale(${0.9 + 0.1 * t});
				`
			};
		}
	});

	// Derived state
	const selectedService = $derived(selectedSlug ? getServiceBySlug(selectedSlug) : null);

	// Reorder services array: selected card first, then others
	const displayedServices = $derived.by(() => {
		if (!selectedService) return services;

		// Put selected service first, keep others in original order
		return [selectedService, ...services.filter((s) => s.slug !== selectedSlug)];
	});

	const hasSelection = $derived(!!selectedService);

	// Respect reduced motion preference
	const shouldAnimate = $derived(!reducedMotionStore.current);

	// Subscribe to animation coordinator stores
	let animPhase = $state('idle');
	let cardStatesMap = $state(new Map());

	// Custom 3D elevation transition for selected card
	// function elevatedFlip(
	// 	node: HTMLElement,
	// 	params: { duration: number; easing: (t: number) => number }
	// ) {
	// 	const { duration, easing } = params;
	// 	return {
	// 		duration,
	// 		easing,
	// 		css: (t: number, u: number) => {
	// 			const eased = easing(t);
	// 			// Elevation arc: 0 → 300px → 0
	// 			const elevation = Math.sin(u * Math.PI) * 300;
	// 			// Scale slightly during elevation
	// 			const scale = 1 + Math.sin(u * Math.PI) * 0.1;
	// 			// Add subtle rotation
	// 			const rotateX = Math.sin(u * Math.PI) * 5;

	// 			return `
	// 				transform: perspective(1500px) translateZ(${elevation}px) scale(${scale}) rotateX(${rotateX}deg);
	// 				z-index: ${u > 0.01 ? 100 : 1};
	// 				box-shadow: 0 ${elevation / 3}px ${elevation}px rgba(0, 0, 0, ${0.3 * Math.sin(u * Math.PI)});
	// 			`;
	// 		}
	// 	};
	// }

	onMount(() => {
		const unsubPhase = animationCoordinator.phase.subscribe((value) => {
			animPhase = value;
		});
		const unsubStates = animationCoordinator.cardStates.subscribe((value) => {
			cardStatesMap = value;
		});

		return () => {
			unsubPhase();
			unsubStates();
		};
	});

	// Get card animation state from coordinator
	function getCardState(slug: string) {
		return cardStatesMap.get(slug);
	}

	// Handle card click to toggle selection
	function handleCardClick(slug: string) {
		if (selectedSlug === slug) {
			// Deselect - trigger deselection animation
			//
			animationCoordinator.deselectCard(
				slug,
				services.map((s) => s.slug)
			);
			// Wait for animation phase to complete before clearing selection
			setTimeout(() => {
				selectedSlug = null;
			}, 100);
		} else {
			// Select new card
			if (selectedSlug) {
				// Deselect current before selecting new
				animationCoordinator.deselectCard(
					selectedSlug,
					services.map((s) => s.slug)
				);
			}
			selectedSlug = slug;

			// Trigger selection animation
			animationCoordinator.selectCard(
				slug,
				services.map((s) => s.slug)
			);
		}
	}

	// Check if we're on mobile
	function checkMobile() {
		isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
	}

	onMount(() => {
		checkMobile();
		window.addEventListener('resize', checkMobile);

		// Setup intersection observer for scroll-triggered visibility

		const observer = new IntersectionObserver(
			([entry]) => {
				// Update visibility store with intersection ratio for hero fade effect
				servicesVisibility.set(entry.intersectionRatio * 3);

				if (entry.isIntersecting) {
					servicesVisible = true;
				}
			},
			{
				rootMargin: '0px 0px -15% 0px',
				threshold: Array.from({ length: 101 }, (_, i) => i / 100)
			}
		);

		if (sectionRef) {
			observer.observe(sectionRef);
		}

		return () => {
			if (sectionRef) {
				observer.unobserve(sectionRef);
			}
			window.removeEventListener('resize', checkMobile);
		};
	});

	onMount(() => {
		// if (selectedSlug ) {
		// 	// Deselect - trigger deselection animation
		// 	//
		// 	animationCoordinator.deselectCard(
		// 		selectedSlug,
		// 		services.map((s) => s.slug)
		// 	);
		// 	// Wait for animation phase to complete before clearing selection
		// 	setTimeout(() => {
		// 		selectedSlug = null;
		// 	}, 100);
		// } else {
		// 	// Select new card
		// 	if (selectedSlug) {
		// 		// Deselect current before selecting new
		// 		animationCoordinator.deselectCard(
		// 			selectedSlug,
		// 			services.map((s) => s.slug)
		// 		);
		// 	}
		// }
		// Trigger selection animation
		// if (selectedSlug) {
		// 	animationCoordinator.selectCard(
		// 		selectedSlug,
		// 		services.map((s) => s.slug)
		// 	);
		// }
	});

	// Handle keyboard navigation
	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape' && selectedSlug) {
			handleCardClick(selectedSlug);
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

<svelte:head>
	<script src="https://unpkg.com/lucide@latest"></script>
</svelte:head>

<!-- Title only shown when no selection -->
<section
	class="services base-grid"
	id="services"
	bind:this={sectionRef}
	class:has-selection={hasSelection}
>
	<div class="container base-grid">
		<h2 class="section-title">
			{#if servicesVisible}
				<span> What We Do </span>
			{/if}
		</h2>

		<div class="services-grid" class:has-selection={hasSelection}>
			{#each displayedServices as service, i (service.slug)}
				{@const isSelected = service.slug === selectedSlug}
				{@const shouldHide = hasSelection && !isSelected && animPhase === 'complete'}
				{@const isRepositioning =
					hasSelection && isSelected && animPhase !== 'idle' && animPhase !== 'complete'}

				<div
					class="card-wrapper"
					class:is-selected={isSelected}
					class:is-hidden={shouldHide}
					class:is-elevated={isRepositioning}
					class:is-exiting={hasSelection && !isSelected && animPhase !== 'complete'}
					in:receive={{ key: service.slug }}
					out:send={{ key: service.slug }}
					animate:flip={{ duration: shouldAnimate ? 800 : 0, easing: quintOut }}
				>
					{#if !shouldHide}
						<ServiceCard
							{service}
							{isSelected}
							cardState={getCardState(service.slug)}
							delay={hasSelection ? 0 : i * 150}
							onclick={() => handleCardClick(service.slug)}
						/>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Detail content appears after animation -->
		{#if hasSelection && animPhase === 'complete' && selectedService}
			<div
				class="detail-content-area"
				in:fly={{
					x: shouldAnimate ? 100 : 0,
					duration: 600,
					delay: 200,
					easing: quintOut
				}}
			>
				<DetailContentGrid service={selectedService} />
			</div>
		{/if}
	</div>

	<!-- Screen reader announcements -->
	<div role="status" aria-live="polite" aria-atomic="true" class="sr-only">
		{#if selectedService}
			Now viewing {selectedService.title} details. Press Escape to return to all services.
		{:else}
			Viewing all services
		{/if}
	</div>
</section>

<style lang="scss">
	.services {
		--top-space: 30rem;
		--bottom-space: 30rem;

		min-height: 100vh;
		background: var(--background-dark);
		grid-template-rows: var(--top-space) auto var(--bottom-space);

		grid-column: 1 / -1;

		@media (min-width: 767px) {
			--top-space: 15rem;
			--bottom-space: 15rem;
		}
	}

	.container {
		--card-size-h: 30rem;
		--card-size-w: 30rem;
		grid-template-rows: minmax(5rem, 10rem) auto;
		grid-column: 1 / -1;
		grid-row: 2;

		@media (min-width: 767px) {
			grid-template-rows: var(--top-space) auto;
			grid-row: 1 / span 2;
		}

		@media (min-width: 1211px) {
			--card-size-h: 35rem;
		}
	}

	.section-title {
		text-align: center;
		font-size: var(--font-size-h2);
		margin-bottom: var(--spacing-3xl);
		color: var(--primary-blue-bright);
		font-weight: 700;
		text-shadow: 0 0 20px rgba(96, 165, 250, 0.3);

		grid-column: 1 / -1;
		justify-self: center;
		align-self: center;
	}

	.services-grid {
		z-index: 1;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(var(--card-size-w), 1fr));
		grid-template-rows: repeat(auto-fit, var(--card-size-h));
		gap: var(--spacing-2xl);
		transition: grid-template-columns 0.4s cubic-bezier(0.16, 1, 0.3, 1);
		perspective: 2000px;
		perspective-origin: center center;
		transform-style: preserve-3d;

		grid-column: 2 / -2;
		grid-row: 2;

		@media (min-width: 1550px) {
			grid-column: 3 / -3;
		}
	}

	.has-selection {
		@media (max-width: 768px) {
			grid-template-columns: minmax(var(--card-size-w), 1fr);
			grid-template-rows: var(--card-size-h);

			& > * {
				grid-column: 1;
				grid-row: 1;
			}
		}
	}

	.card-wrapper {
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: var(--card-size-h);
		transform-style: preserve-3d;
		transform-origin: center center;
		opacity: 1;
		transition:
			transform 0.8s cubic-bezier(0.16, 1, 0.3, 1),
			z-index 0s;
		transition: opacity 0.8s ease;

		&.is-selected {
			grid-column: 1;
			/* Lock dimensions to prevent stretching */
			min-height: var(--card-size-h);
		}

		&.is-exiting {
			pointer-events: none;
			visibility: hidden;
			opacity: 0;
		}

		&.is-hidden {
			visibility: hidden;
			opacity: 0;
		}
	}

	.detail-content-area {
		z-index: 0;
		height: 70rem;

		display: grid;
		grid-template-columns: repeat(3, minmax(var(--card-size-w), 1fr));
		grid-template-rows: repeat(2, var(--card-size-h));
		gap: var(--spacing-2xl);

		grid-column: 2 / -2;
		grid-row: 3;

		@media (min-width: 1550px) {
			grid-column: 3 / -3;
		}

		@media (min-width: 767px) {
			grid-row: 2;
		}
	}

	/* Screen reader only */
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}
</style>
