<script lang="ts">
	import { fly, fade, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { prefersReducedMotion } from 'svelte/motion';

	interface Props {
		images: string[];
		text: string;
		stats: { label: string; value: string }[];
	}

	let { images, text, stats }: Props = $props();

	const shouldAnimate = !prefersReducedMotion.current;
</script>

<div class="mobile-demo" transition:fly={{ y: shouldAnimate ? 40 : 0, duration: 600, easing: quintOut }}>
	<div class="content-grid">
		<div class="demo-visual" transition:scale={{ duration: 800, delay: 200, easing: quintOut }}>
			<div class="phone-mockup">
				<div class="phone-frame">
					<div class="phone-notch"></div>
					<div class="phone-screen">
						{#if images[0]}
							<img src={images[0]} alt="Mobile website demo" />
						{:else}
							<div class="placeholder">
								<i data-lucide="smartphone"></i>
								<p>Mobile-Responsive Design</p>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<div class="demo-info">
			<div class="demo-text" transition:fade={{ duration: 600, delay: 300 }}>
				<p>{text}</p>
			</div>

			<div class="stats-list" transition:fly={{ y: shouldAnimate ? 20 : 0, duration: 600, delay: 400, easing: quintOut }}>
				{#each stats as stat, i (i)}
					<div class="stat-item" transition:fly={{ x: shouldAnimate ? -20 : 0, duration: 400, delay: 500 + i * 100, easing: quintOut }}>
						<div class="stat-icon">
							<i data-lucide="trending-up"></i>
						</div>
						<div class="stat-content">
							<div class="stat-value">{stat.value}</div>
							<div class="stat-label">{stat.label}</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.mobile-demo {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
	}

	.content-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--spacing-3xl);
		align-items: center;
	}

	.demo-visual {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.phone-mockup {
		position: relative;
		width: 100%;
		max-width: 320px;
		aspect-ratio: 9 / 19.5;
	}

	.phone-frame {
		width: 100%;
		height: 100%;
		background: #1f2937;
		border-radius: 36px;
		padding: 12px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4),
			inset 0 0 0 2px rgba(255, 255, 255, 0.1);
		position: relative;
	}

	.phone-notch {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 120px;
		height: 24px;
		background: #1f2937;
		border-radius: 0 0 20px 20px;
		z-index: 10;
	}

	.phone-screen {
		width: 100%;
		height: 100%;
		background: white;
		border-radius: 28px;
		overflow: hidden;
		position: relative;
	}

	.phone-screen img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.placeholder {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%);
		color: white;
		padding: var(--spacing-lg);
	}

	.placeholder i {
		width: 64px;
		height: 64px;
		margin-bottom: var(--spacing-md);
	}

	.placeholder p {
		text-align: center;
		font-size: var(--font-size-base);
		font-weight: 600;
	}

	.demo-info {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-2xl);
	}

	.demo-text p {
		color: var(--text-secondary);
		font-size: var(--font-size-lg);
		line-height: var(--line-height-relaxed);
	}

	.stats-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.stat-item {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		background: var(--background-card);
		border: 2px solid var(--primary-blue);
		border-radius: var(--radius-sm);
		padding: var(--spacing-lg);
		transition: all 0.3s ease;
	}

	.stat-item:hover {
		border-color: var(--primary-blue-light);
		box-shadow: 0 8px 24px rgba(37, 99, 235, 0.3);
		transform: translateX(4px);
	}

	.stat-icon {
		flex-shrink: 0;
		color: var(--primary-blue-bright);
	}

	.stat-icon i {
		width: 32px;
		height: 32px;
	}

	.stat-content {
		flex: 1;
	}

	.stat-value {
		font-size: var(--font-size-h3);
		font-weight: 700;
		color: var(--primary-blue-bright);
		margin-bottom: var(--spacing-xs);
	}

	.stat-label {
		color: var(--text-tertiary);
		font-size: var(--font-size-sm);
	}

	@media (max-width: 968px) {
		.content-grid {
			grid-template-columns: 1fr;
			gap: var(--spacing-2xl);
		}

		.phone-mockup {
			max-width: 280px;
		}

		.demo-text p {
			font-size: var(--font-size-base);
			text-align: center;
		}
	}
</style>

