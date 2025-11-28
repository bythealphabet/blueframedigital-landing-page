<script lang="ts">
	import { onMount } from 'svelte';

	let isVisible = $state(false);

	function toggleVisibility() {
		if (window.pageYOffset > 300) {
			isVisible = true;
		} else {
			isVisible = false;
		}
	}

	function scrollToTop() {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}

	onMount(() => {
		window.addEventListener('scroll', toggleVisibility, { passive: true });
		toggleVisibility();

		// Initialize Lucide icons
		if (typeof window !== 'undefined' && (window as any).lucide) {
			(window as any).lucide.createIcons();
		}

		return () => {
			window.removeEventListener('scroll', toggleVisibility);
		};
	});
</script>

<svelte:head>
	<script src="https://unpkg.com/lucide@latest"></script>
</svelte:head>

<button class="back-to-top" class:visible={isVisible} onclick={scrollToTop} aria-label="Back to top">
	<i data-lucide="arrow-up" width="24" height="24"></i>
</button>

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
		opacity: 0;
		visibility: hidden;
		transform: translateY(20px);
		transition: var(--transition-normal);
		z-index: 1000;
		box-shadow: 0 0 20px rgba(30, 58, 138, 0.4);
	}

	.back-to-top.visible {
		opacity: 1;
		visibility: visible;
		transform: translateY(0);
	}

	.back-to-top:hover {
		background: var(--primary-blue-light);
		border-color: var(--primary-blue-light);
		box-shadow: 0 0 30px rgba(37, 99, 235, 0.6);
		transform: translateY(-3px) scale(1.1);
	}

	.back-to-top:active {
		transform: translateY(-1px) scale(1.05);
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
