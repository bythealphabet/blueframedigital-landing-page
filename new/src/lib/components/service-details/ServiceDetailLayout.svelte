<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { goto } from '$app/navigation';
	import { prefersReducedMotion } from 'svelte/motion';

	interface Props {
		title: string;
		children?: any;
	}

	let { title, children }: Props = $props();

	function handleBack() {
		goto('/');
	}

	const shouldAnimate = !prefersReducedMotion.current;
</script>

<section class="service-detail">
	<div class="container">
		<button
			class="back-button"
			onclick={handleBack}
			transition:fly={{ x: shouldAnimate ? -20 : 0, duration: 400, easing: quintOut }}
			aria-label="Go back to services"
		>
			<i data-lucide="arrow-left"></i>
			<span>Back to Services</span>
		</button>

		<div class="detail-content" transition:fade={{ duration: 400, delay: 200 }}>
			{@render children()}
		</div>
	</div>
</section>

<style>
	.service-detail {
		min-height: 100vh;
		padding: var(--spacing-3xl) var(--spacing-xl);
		background: var(--background-dark);
	}

	.container {
		max-width: 1400px;
		margin: 0 auto;
		width: 100%;
	}

	.back-button {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		background: var(--background-card);
		border: 2px solid var(--primary-blue);
		color: var(--primary-blue-bright);
		padding: var(--spacing-md) var(--spacing-lg);
		border-radius: var(--radius-sm);
		font-size: var(--font-size-base);
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		margin-bottom: var(--spacing-2xl);
	}

	.back-button:hover {
		background: var(--primary-blue);
		color: var(--text-primary);
		transform: translateX(-4px);
		box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);
	}

	.back-button i {
		width: 20px;
		height: 20px;
	}

	.detail-content {
		margin-top: var(--spacing-xl);
	}

	@media (max-width: 768px) {
		.service-detail {
			padding: var(--spacing-2xl) var(--spacing-lg);
		}

		.back-button {
			padding: var(--spacing-sm) var(--spacing-md);
			font-size: var(--font-size-sm);
		}
	}
</style>

