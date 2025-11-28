<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { prefersReducedMotion } from 'svelte/motion';

	interface Props {
		text: string;
		features: string[];
		stats: { label: string; value: string }[];
	}

	let { text, features, stats }: Props = $props();

	const shouldAnimate = !prefersReducedMotion.current;
</script>

<div class="lead-gen-info" transition:fly={{ y: shouldAnimate ? 40 : 0, duration: 600, easing: quintOut }}>
	<div class="intro-text" transition:fade={{ duration: 600, delay: 200 }}>
		<p>{text}</p>
	</div>

	<div class="stats-grid" transition:fly={{ y: shouldAnimate ? 20 : 0, duration: 600, delay: 300, easing: quintOut }}>
		{#each stats as stat, i (i)}
			<div class="stat-card" transition:scale={{ duration: 400, delay: 400 + i * 100, easing: quintOut }}>
				<div class="stat-value">{stat.value}</div>
				<div class="stat-label">{stat.label}</div>
			</div>
		{/each}
	</div>

	<div class="features" transition:fly={{ y: shouldAnimate ? 20 : 0, duration: 600, delay: 500, easing: quintOut }}>
		<h3>What You Get</h3>
		<div class="features-grid">
			{#each features as feature, i (i)}
				<div class="feature-item" transition:fly={{ x: shouldAnimate ? -20 : 0, duration: 400, delay: 600 + i * 80, easing: quintOut }}>
					<div class="feature-icon">
						<i data-lucide="check-circle"></i>
					</div>
					<p>{feature}</p>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.lead-gen-info {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
	}

	.intro-text {
		text-align: center;
		margin-bottom: var(--spacing-3xl);
	}

	.intro-text p {
		color: var(--text-secondary);
		font-size: var(--font-size-lg);
		line-height: var(--line-height-relaxed);
		max-width: 900px;
		margin: 0 auto;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--spacing-xl);
		margin-bottom: var(--spacing-3xl);
	}

	.stat-card {
		background: var(--background-card);
		border: 2px solid var(--primary-blue);
		border-radius: var(--radius-sm);
		padding: var(--spacing-xl);
		text-align: center;
		transition: all 0.3s ease;
	}

	.stat-card:hover {
		border-color: var(--primary-blue-light);
		box-shadow: 0 12px 40px rgba(37, 99, 235, 0.3);
		transform: translateY(-4px);
	}

	.stat-value {
		font-size: 3rem;
		font-weight: 700;
		color: var(--primary-blue-bright);
		margin-bottom: var(--spacing-sm);
		text-shadow: 0 0 20px rgba(96, 165, 250, 0.3);
	}

	.stat-label {
		color: var(--text-tertiary);
		font-size: var(--font-size-base);
	}

	.features {
		background: var(--background-card);
		border: 2px solid var(--primary-blue);
		border-radius: var(--radius-sm);
		padding: var(--spacing-2xl);
	}

	.features h3 {
		color: var(--primary-blue-bright);
		font-size: var(--font-size-h3);
		margin-bottom: var(--spacing-xl);
		text-align: center;
	}

	.features-grid {
		display: grid;
		gap: var(--spacing-lg);
	}

	.feature-item {
		display: flex;
		align-items: flex-start;
		gap: var(--spacing-md);
	}

	.feature-icon {
		flex-shrink: 0;
		color: var(--primary-blue-bright);
		margin-top: 2px;
	}

	.feature-icon i {
		width: 24px;
		height: 24px;
	}

	.feature-item p {
		color: var(--text-secondary);
		font-size: var(--font-size-base);
		line-height: var(--line-height-relaxed);
		margin: 0;
	}

	@media (max-width: 768px) {
		.intro-text p {
			font-size: var(--font-size-base);
		}

		.stats-grid {
			grid-template-columns: 1fr;
			gap: var(--spacing-md);
		}

		.stat-value {
			font-size: 2.5rem;
		}

		.features {
			padding: var(--spacing-lg);
		}
	}
</style>

