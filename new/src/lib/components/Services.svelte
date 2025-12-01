<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, fade, crossfade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { flip } from 'svelte/animate';
	import { quintOut } from 'svelte/easing';
	import { prefersReducedMotion as reducedMotionStore } from 'svelte/motion';
	import ServiceCard from '$lib/components/ServiceCard.svelte';
	import { servicesVisibility, hasSelectedCard } from '$lib/stores/scrollStore';
	import { services, getServiceBySlug } from '$lib/data/services';
	import { animationCoordinator } from '$lib/animations/animationCoordinator';
	import DetailContentGrid from './service-details/DetailContentGrid.svelte';

	// Accept optional selectedSlug prop from parent (e.g., from URL routing)
	let { selectedSlug: initialSlug = null }: { selectedSlug?: string | null } = $props();

	// Detect if we're on the home page
	const isHomePage = $derived($page.url.pathname === '/');

	// Local state for selection - initialized from prop if provided
	let selectedSlug = $state<string | null>(initialSlug);

	let servicesVisible = $state(false);
	let sectionRef: HTMLElement;
	let isMobile = $state(false);
	let scrollY = $state(0);
	let titleRef: HTMLElement;
	let previousHasSelection = $state(false);

	// Create crossfade function that returns dynamic duration based on viewport
	function createCrossfade() {
		// Use 0ms duration on mobile for instant transitions, 800ms on desktop
		const duration = isMobile ? 0 : 800;
		return crossfade({
			duration,
			easing: quintOut,
			fallback() {
				return {
					duration: isMobile ? 0 : 300,
					easing: quintOut,
					css: (t) => `
						opacity: ${t};
						transform: perspective(1000px) translateZ(${-200 * (1 - t)}px) scale(${0.9 + 0.1 * t});
					`
				};
			}
		});
	}

	// Initialize crossfade - using $derived to make it reactive
	const crossfadeTransitions = $derived(createCrossfade());
	const send = $derived(crossfadeTransitions[0]);
	const receive = $derived(crossfadeTransitions[1]);

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

	onMount(() => {
		checkMobile();
		window.addEventListener('resize', checkMobile);

		// Track scroll position
		const handleScroll = () => {
			scrollY = window.scrollY;
		};
		window.addEventListener('scroll', handleScroll);

		// Setup intersection observer for scroll-triggered visibility
		const observer = new IntersectionObserver(
			([entry]) => {
				// Update visibility store with intersection ratio for hero fade effect
				servicesVisibility.set(entry.intersectionRatio * 3);

				// Update visibility state based on intersection
				servicesVisible = entry.isIntersecting;
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
			window.removeEventListener('scroll', handleScroll);
		};
	});

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

	// Handle scroll locking and auto-scroll when selection changes
	$effect(() => {
		if (typeof window === 'undefined') return;

		// Update store for back-to-top button
		hasSelectedCard.set(hasSelection);

		if (hasSelection) {
			// Lock scroll
			const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
			document.body.style.overflow = 'hidden';
			document.body.style.paddingRight = `${scrollbarWidth}px`;

			// Scroll to position section at top with comfortable spacing
			// Use sectionRef for mobile, titleRef for desktop
			const scrollTarget = isMobile ? sectionRef : titleRef;
			if (scrollTarget) {
				const targetTop = scrollTarget.getBoundingClientRect().top + window.scrollY;
				// Mobile: scroll to top of section (0px offset), Desktop: 60px offset for title
				const targetScroll = isMobile ? targetTop : targetTop - 60;

				window.scrollTo({
					top: targetScroll,
					behavior: 'smooth'
				});
			}
		} else {
			// Unlock scroll
			document.body.style.overflow = '';
			document.body.style.paddingRight = '';
			
			// Only scroll when transitioning from selected to unselected (actual deselection)
			// Not when component first loads with no selection
			if (previousHasSelection) {
				if (isMobile && sectionRef) {
					// Mobile: scroll to section top minus some offset to show the title
					const targetTop = sectionRef.getBoundingClientRect().top + window.scrollY;
					// Subtract offset to position title near top of viewport
					const targetScroll = targetTop - 80;

					window.scrollTo({
						top: targetScroll,
						behavior: 'smooth'
					});
				} else if (!isMobile && titleRef) {
					// Desktop: scroll to title position
					const targetTop = titleRef.getBoundingClientRect().top + window.scrollY;
					const targetScroll = targetTop - 60;

					window.scrollTo({
						top: targetScroll,
						behavior: 'smooth'
					});
				}
			}
		}

		// Update previous state for next effect run
		previousHasSelection = hasSelection;
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
		<h2 class="section-title" class:section-title--compact={hasSelection} bind:this={titleRef}>
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
					animate:flip={{ duration: shouldAnimate && !isMobile ? 800 : 0, easing: quintOut }}
				>
					{#if !shouldHide}
						<ServiceCard
							{service}
							{isSelected}
							{isHomePage}
							cardState={getCardState(service.slug)}
							cardIndex={i}
							delay={hasSelection ? 0 : i * 150}
							onclick={() => handleCardClick(service.slug)}
						/>
					{/if}
				</div>
			{/each}
		</div>

	<!-- Close button - appears when a card is selected -->
	{#if hasSelection}
		<button
			class="close-button"
			onclick={() => selectedSlug && handleCardClick(selectedSlug)}
			aria-label="Close service details"
			in:fade={{ duration: 300, delay: 300 }}
		>
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
				<line x1="18" y1="6" x2="6" y2="18"></line>
				<line x1="6" y1="6" x2="18" y2="18"></line>
			</svg>
		</button>
	{/if}

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

		&.has-selection {
			/* When selected, allow scrolling within the locked body */
			grid-template-rows: 0 auto 0;
			padding-top: var(--spacing-xl);
		}

		@media (min-width: 767px) {
			--top-space: 15rem;
			--bottom-space: 15rem;
		}

		@media (max-width: 768px) {
			&.has-selection {
				/* Mobile: fill viewport, no extra padding */
				padding-top: var(--spacing-md);
				min-height: 100vh;
				height: 100vh;
				max-height: 100vh;
				overflow: hidden;
			}
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

		/* When a card is selected - use dedicated layout */
		.services.has-selection & {
			@media (min-width: 769px) {
				/* Desktop: title row (hidden), card+content rows */
				grid-template-rows: auto auto auto;
				gap: 0;
			}
			
			@media (max-width: 768px) {
				--card-size-h: 8rem;
				/* Mobile: no title row, just card in row 1, content area in row 2 */
				grid-template-rows: auto 1fr;
				gap: var(--spacing-md);
			}
		}
	}

	.section-title {
		text-align: center;
		font-size: var(--font-size-h2);
		margin-bottom: var(--spacing-3xl);
		color: var(--primary-blue-bright);
		font-weight: 700;
		text-shadow: 0 0 20px rgba(96, 165, 250, 0.3);
		transition:
			font-size 0.6s cubic-bezier(0.16, 1, 0.3, 1),
			margin-bottom 0.6s cubic-bezier(0.16, 1, 0.3, 1),
			opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);

		grid-column: 1 / -1;
		grid-row: 1;
		justify-self: center;
		align-self: center;
	}

	.section-title--compact {
		font-size: var(--font-size-h3);
		margin-bottom: var(--spacing-xl);
		opacity: 0;
		pointer-events: none;
		
		span {
			visibility: hidden;
		}
		
		@media (max-width: 768px) {
			/* On mobile, completely hide the title when compact */
			display: none;
		}
	}

	.services-grid {
		z-index: 1;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(var(--card-size-w), 1fr));
		grid-template-rows: repeat(auto-fit, var(--card-size-h));
		gap: var(--spacing-2xl);
		transition: 
			grid-template-columns 0.4s cubic-bezier(0.16, 1, 0.3, 1),
			grid-row 0.6s cubic-bezier(0.16, 1, 0.3, 1);
		perspective: 2000px;
		perspective-origin: center center;
		transform-style: preserve-3d;

		grid-column: 2 / -2;
		grid-row: 2;

		@media (min-width: 1550px) {
			grid-column: 3 / -3;
		}

		@media (max-width: 768px) {
			grid-column: 1 / -1;
			padding: 0 var(--spacing-lg);
		}
		
		/* When selected, span rows to be with title */
		.services.has-selection & {
			@media (min-width: 769px) {
				grid-row: 1 / -1;
				align-self: start;
				padding-top: var(--spacing-xl);
			}
			
			@media (max-width: 768px) {
				/* Mobile: stay in row 1 with proper spacing */
				grid-row: 1;
				padding-bottom: var(--spacing-md);
			}
		}
	}

	.services-grid.has-selection {
		@media (max-width: 768px) {
			grid-template-columns: 1fr;
			grid-template-rows: auto;
			gap: 0;

			& > * {
				grid-column: 1;
				grid-row: 1;
			}
		}
	}

	.card-wrapper {
		position: relative;
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		height: 100%;
		min-height: var(--card-size-h);
		transform-style: preserve-3d;
		transform-origin: center center;
		opacity: 1;
		z-index: 1;
		transition:
			transform 0.8s cubic-bezier(0.16, 1, 0.3, 1),
			grid-template-rows 0.8s cubic-bezier(0.16, 1, 0.3, 1),
			min-height 0.8s cubic-bezier(0.16, 1, 0.3, 1),
			opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
			z-index 0s;

		&.is-selected {
			grid-column: 1;
			/* Shrink to compact size */
			grid-template-rows: auto;
			min-height: 8rem;
			max-height: 10rem;

			@media (min-width: 769px) {
				/* Desktop: Place behind the carousel */
				z-index: 0;
			}
			
			@media (max-width: 768px) {
				/* Mobile: Stay above carousel, compact for visibility */
				min-height: 6rem;
				max-height: 8rem;
				z-index: 3;
				position: relative;
			}
		}

		&.is-exiting {
			pointer-events: none;
			/* Keep visible during animation on desktop, instant hide on mobile */
			opacity: 0.3;

			@media (max-width: 768px) {
				/* Instant hide on mobile */
				opacity: 0;
				visibility: hidden;
			}
		}

		&.is-hidden {
			visibility: hidden;
			opacity: 0;
		}
	}

	.detail-content-area {
		z-index: 1;

		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr;
		gap: var(--spacing-lg);

		grid-column: 2 / -2;
		grid-row: 2;
		
		/* Better height management */
		min-height: 500px;
		max-height: calc(100vh - 200px);

		@media (min-width: 1550px) {
			grid-column: 3 / -3;
		}

		@media (max-width: 768px) {
			/* Mobile: Show below the card in row 2 */
			grid-column: 1 / -1;
			grid-row: 2;
			padding: 0 var(--spacing-md);
			min-height: 450px;
			max-height: none;
			margin-top: 0;
			z-index: 2;
		}

		@media (min-width: 769px) {
			grid-row: 2;
			min-height: 600px;
			max-height: 800px;
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

	/* Close button */
	.close-button {
		position: fixed;
		top: var(--spacing-lg);
		right: var(--spacing-lg);
		z-index: 1000;
		
		display: flex;
		align-items: center;
		justify-content: center;
		
		width: 3rem;
		height: 3rem;
		
		background: rgba(0, 0, 0, 0.8);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(96, 165, 250, 0.3);
		border-radius: 50%;
		
		color: var(--primary-blue-bright);
		cursor: pointer;
		
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
		
		&:hover {
			background: rgba(96, 165, 250, 0.2);
			border-color: var(--primary-blue-bright);
			transform: scale(1.05);
		}
		
		&:active {
			transform: scale(0.95);
		}

		svg {
			width: 1.5rem;
			height: 1.5rem;
		}

		/* Larger size on desktop */
		@media (min-width: 769px) {
			width: 4.5rem;
			height: 4.5rem;
			top: var(--spacing-xl);
			right: var(--spacing-xl);
			border-width: 2px;

			svg {
				width: 2.25rem;
				height: 2.25rem;
			}
		}
	}
</style>
