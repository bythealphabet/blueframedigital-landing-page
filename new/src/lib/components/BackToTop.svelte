<script lang="ts">
	import { onMount } from 'svelte';
	import { Spring } from 'svelte/motion';
	import { ArrowUp } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { hasSelectedCard } from '$lib/stores/scrollStore';

	let scrollY = $state(0);
	let cardSelected = $state(false);

	// Spring for back-to-top button scale (smooth appearance/disappearance)
	const backToTopScale = new Spring(0, {
		stiffness: 0.2,
		damping: 0.6
	});

	// Derived state for showing button - hide if card is selected
	let showBackToTop = $derived(scrollY > 300 && !cardSelected);

	function scrollToTop() {
		// Navigate to home page and scroll to top
		goto('/', { replaceState: false, noScroll: false });
	}

	onMount(() => {
		const handleScroll = () => {
			scrollY = window.scrollY;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();

		// Subscribe to card selection state
		const unsubscribe = hasSelectedCard.subscribe((value) => {
			cardSelected = value;
		});

		return () => {
			window.removeEventListener('scroll', handleScroll);
			unsubscribe();
		};
	});

	// Watch showBackToTop and update spring
	$effect(() => {
		backToTopScale.target = showBackToTop ? 1 : 0;
	});
</script>

{#if backToTopScale.current > 0.01}
	<button
		class="back-to-top"
		onclick={scrollToTop}
		style="transform: scale({backToTopScale.current}); opacity: {backToTopScale.current}"
		aria-label="Back to top"
	>
		<ArrowUp size={24} />
	</button>
{/if}

<style>
	.back-to-top {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		width: 50px;
		height: 50px;
		background: var(--primary-blue);
		color: var(--text-primary);
		border: 2px solid var(--primary-blue);
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		box-shadow: 0 0 20px rgba(30, 58, 138, 0.4);
		will-change: transform, opacity;
		transition: background 0.3s ease;
	}

	.back-to-top:hover {
		background: var(--primary-blue-light);
		border-color: var(--primary-blue-light);
		box-shadow: 0 0 30px rgba(37, 99, 235, 0.6);
	}

	.back-to-top :global(svg) {
		color: var(--text-primary);
	}

	@media (max-width: 768px) {
		.back-to-top {
			bottom: 1.5rem;
			right: 1.5rem;
			width: 45px;
			height: 45px;
		}
	}
</style>
