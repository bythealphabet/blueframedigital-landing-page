<script lang="ts">
	import { onMount } from 'svelte';
	import { Spring } from 'svelte/motion';

	let scrollY = $state(0);

	// Spring for back-to-top button scale (smooth appearance/disappearance)
	const backToTopScale = new Spring(0, {
		stiffness: 0.2,
		damping: 0.6
	});

	// Derived state for showing button
	let showBackToTop = $derived(scrollY > 300);

	function scrollToTop() {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}

	onMount(() => {
		const handleScroll = () => {
			scrollY = window.scrollY;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();

		// Initialize Lucide icons
		if (typeof window !== 'undefined' && (window as any).lucide) {
			(window as any).lucide.createIcons();
		}

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	// Watch showBackToTop and update spring
	$effect(() => {
		backToTopScale.target = showBackToTop ? 1 : 0;
	});
</script>

<svelte:head>
	<script src="https://unpkg.com/lucide@latest"></script>
</svelte:head>

{#if backToTopScale.current > 0.01}
	<button
		class="back-to-top"
		onclick={scrollToTop}
		style="transform: scale({backToTopScale.current}); opacity: {backToTopScale.current}"
		aria-label="Back to top"
	>
		<i data-lucide="arrow-up"></i>
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
