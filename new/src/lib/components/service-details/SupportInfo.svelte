<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { prefersReducedMotion } from 'svelte/motion';

	interface Props {
		images: string[];
		text: string;
		features: string[];
	}

	let { images, text, features }: Props = $props();

	const shouldAnimate = !prefersReducedMotion.current;
</script>

<div class="support-info" transition:fly={{ y: shouldAnimate ? 40 : 0, duration: 600, easing: quintOut }}>
	<div class="content-grid">
		<div class="support-visual" transition:fade={{ duration: 600, delay: 200 }}>
			{#if images[0]}
				<img src={images[0]} alt="Support team" />
			{:else}
				<div class="placeholder">
					<i data-lucide="headphones"></i>
					<p>Always Here to Help</p>
				</div>
			{/if}
		</div>

		<div class="support-content">
			<div class="intro-text" transition:fade={{ duration: 600, delay: 300 }}>
				<p>{text}</p>
			</div>
		</div>
	</div>

	<div class="features-section" transition:fly={{ y: shouldAnimate ? 20 : 0, duration: 600, delay: 400, easing: quintOut }}>
		<h3>Support Services Included</h3>
		<div class="features-grid">
			{#each features as feature, i (i)}
				<div class="feature-card" transition:fly={{ y: shouldAnimate ? 20 : 0, duration: 400, delay: 500 + i * 60, easing: quintOut }}>
					<div class="feature-icon">
						<i data-lucide="shield-check"></i>
					</div>
					<p>{feature}</p>
				</div>
			{/each}
		</div>
	</div>

	<div class="cta-section" transition:fade={{ duration: 600, delay: 800 }}>
		<div class="cta-content">
			<i data-lucide="coffee"></i>
			<h4>Focus on What You Do Best</h4>
			<p>
				You build. We maintain. It's that simple. With our ongoing support, you'll have peace of
				mind knowing your website is always up-to-date, secure, and working perfectly.
			</p>
		</div>
	</div>
</div>

<style>
	.support-info {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
	}

	.content-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--spacing-3xl);
		align-items: center;
		margin-bottom: var(--spacing-3xl);
	}

	.support-visual {
		border-radius: var(--radius-sm);
		overflow: hidden;
		border: 2px solid var(--primary-blue);
		aspect-ratio: 4 / 3;
	}

	.support-visual img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-blue-dark) 100%);
		color: white;
		padding: var(--spacing-xl);
	}

	.placeholder i {
		width: 80px;
		height: 80px;
		margin-bottom: var(--spacing-lg);
	}

	.placeholder p {
		font-size: var(--font-size-h3);
		font-weight: 600;
		text-align: center;
	}

	.intro-text p {
		color: var(--text-secondary);
		font-size: var(--font-size-lg);
		line-height: var(--line-height-relaxed);
	}

	.features-section {
		background: var(--background-card);
		border: 2px solid var(--primary-blue);
		border-radius: var(--radius-sm);
		padding: var(--spacing-2xl);
		margin-bottom: var(--spacing-3xl);
	}

	.features-section h3 {
		color: var(--primary-blue-bright);
		font-size: var(--font-size-h3);
		margin-bottom: var(--spacing-xl);
		text-align: center;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--spacing-lg);
	}

	.feature-card {
		display: flex;
		align-items: flex-start;
		gap: var(--spacing-md);
		padding: var(--spacing-lg);
		background: rgba(37, 99, 235, 0.05);
		border-radius: var(--radius-sm);
		border: 1px solid transparent;
		transition: all 0.3s ease;
	}

	.feature-card:hover {
		border-color: var(--primary-blue);
		background: rgba(37, 99, 235, 0.1);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
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

	.feature-card p {
		color: var(--text-secondary);
		font-size: var(--font-size-base);
		line-height: var(--line-height-relaxed);
		margin: 0;
	}

	.cta-section {
		background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%);
		border: 2px solid var(--primary-blue);
		border-radius: var(--radius-sm);
		padding: var(--spacing-3xl);
		text-align: center;
	}

	.cta-content {
		max-width: 700px;
		margin: 0 auto;
	}

	.cta-content i {
		width: 48px;
		height: 48px;
		color: var(--primary-blue-bright);
		margin-bottom: var(--spacing-lg);
	}

	.cta-content h4 {
		color: var(--primary-blue-bright);
		font-size: var(--font-size-h3);
		margin-bottom: var(--spacing-md);
	}

	.cta-content p {
		color: var(--text-secondary);
		font-size: var(--font-size-lg);
		line-height: var(--line-height-relaxed);
	}

	@media (max-width: 968px) {
		.content-grid {
			grid-template-columns: 1fr;
			gap: var(--spacing-2xl);
		}

		.intro-text p {
			font-size: var(--font-size-base);
		}

		.features-grid {
			grid-template-columns: 1fr;
		}

		.features-section {
			padding: var(--spacing-lg);
		}

		.cta-section {
			padding: var(--spacing-2xl);
		}

		.cta-content p {
			font-size: var(--font-size-base);
		}
	}
</style>

