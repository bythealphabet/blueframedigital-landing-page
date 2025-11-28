<script lang="ts">
	import { fly, fade, scale } from 'svelte/transition';
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

<div class="seo-explainer" transition:fly={{ y: shouldAnimate ? 40 : 0, duration: 600, easing: quintOut }}>
	<div class="story-section" transition:fade={{ duration: 600, delay: 200 }}>
		<div class="story-icon">
			<i data-lucide="map-pin"></i>
		</div>
		<p class="story-text">{text}</p>
	</div>

	<div class="search-visual" transition:scale={{ duration: 600, delay: 300, easing: quintOut }}>
		<div class="search-mockup">
			<div class="search-bar">
				<i data-lucide="search"></i>
				<span>construction company Curaçao</span>
			</div>
			<div class="search-results">
				<div class="result-item featured">
					<div class="result-badge">Your Business</div>
					<div class="result-title">Blue Frame Construction - Curaçao</div>
					<div class="result-url">www.yoursite.com</div>
					<div class="result-description">
						Professional construction services in Willemstad. 20+ years experience in residential
						and commercial projects...
					</div>
					<div class="result-meta">
						<span>★★★★★ 4.9 · (47 reviews)</span>
					</div>
				</div>
				<div class="result-item">
					<div class="result-title">Other Construction Company</div>
					<div class="result-url">www.competitor.com</div>
					<div class="result-description">
						Construction services in Curaçao. Contact us for more information...
					</div>
				</div>
				<div class="result-item">
					<div class="result-title">Another Construction Business</div>
					<div class="result-url">www.another.com</div>
					<div class="result-description">
						We offer construction services. Call today for a quote...
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="features-section" transition:fly={{ y: shouldAnimate ? 20 : 0, duration: 600, delay: 400, easing: quintOut }}>
		<h3>Local SEO Strategy</h3>
		<div class="features-grid">
			{#each features as feature, i (i)}
				<div class="feature-card" transition:fly={{ x: shouldAnimate ? -20 : 0, duration: 400, delay: 500 + i * 80, easing: quintOut }}>
					<div class="feature-icon">
						<i data-lucide="check-circle-2"></i>
					</div>
					<p>{feature}</p>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.seo-explainer {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
	}

	.story-section {
		text-align: center;
		margin-bottom: var(--spacing-3xl);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-lg);
	}

	.story-icon {
		color: var(--primary-blue-bright);
	}

	.story-icon i {
		width: 48px;
		height: 48px;
	}

	.story-text {
		color: var(--text-secondary);
		font-size: var(--font-size-lg);
		line-height: var(--line-height-relaxed);
		max-width: 900px;
	}

	.search-visual {
		margin-bottom: var(--spacing-3xl);
	}

	.search-mockup {
		background: white;
		border-radius: var(--radius-sm);
		overflow: hidden;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
		max-width: 800px;
		margin: 0 auto;
	}

	.search-bar {
		background: #f8f9fa;
		padding: var(--spacing-lg);
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
		border-bottom: 1px solid #e5e7eb;
	}

	.search-bar i {
		width: 20px;
		height: 20px;
		color: #6b7280;
	}

	.search-bar span {
		color: #1f2937;
		font-size: var(--font-size-base);
	}

	.search-results {
		padding: var(--spacing-lg);
		background: white;
	}

	.result-item {
		padding: var(--spacing-lg);
		margin-bottom: var(--spacing-md);
		border-radius: var(--radius-sm);
		transition: background 0.2s ease;
	}

	.result-item:hover {
		background: #f9fafb;
	}

	.result-item.featured {
		background: #eff6ff;
		border: 2px solid var(--primary-blue);
		position: relative;
	}

	.result-badge {
		display: inline-block;
		background: var(--primary-blue);
		color: white;
		padding: var(--spacing-xs) var(--spacing-sm);
		border-radius: var(--radius-sm);
		font-size: var(--font-size-sm);
		font-weight: 600;
		margin-bottom: var(--spacing-sm);
	}

	.result-title {
		color: #1a0dab;
		font-size: var(--font-size-lg);
		font-weight: 500;
		margin-bottom: var(--spacing-xs);
		cursor: pointer;
	}

	.result-title:hover {
		text-decoration: underline;
	}

	.result-url {
		color: #006621;
		font-size: var(--font-size-sm);
		margin-bottom: var(--spacing-xs);
	}

	.result-description {
		color: #4d5156;
		font-size: var(--font-size-sm);
		line-height: 1.6;
		margin-bottom: var(--spacing-xs);
	}

	.result-meta {
		color: #70757a;
		font-size: var(--font-size-sm);
	}

	.result-meta span {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-xs);
	}

	.features-section {
		background: var(--background-card);
		border: 2px solid var(--primary-blue);
		border-radius: var(--radius-sm);
		padding: var(--spacing-2xl);
	}

	.features-section h3 {
		color: var(--primary-blue-bright);
		font-size: var(--font-size-h3);
		margin-bottom: var(--spacing-xl);
		text-align: center;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: var(--spacing-lg);
	}

	.feature-card {
		display: flex;
		align-items: flex-start;
		gap: var(--spacing-md);
		padding: var(--spacing-md);
		background: rgba(37, 99, 235, 0.05);
		border-radius: var(--radius-sm);
		transition: all 0.3s ease;
	}

	.feature-card:hover {
		background: rgba(37, 99, 235, 0.1);
		transform: translateX(4px);
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

	@media (max-width: 768px) {
		.story-text {
			font-size: var(--font-size-base);
		}

		.search-mockup {
			margin: 0 calc(-1 * var(--spacing-lg));
		}

		.features-grid {
			grid-template-columns: 1fr;
		}

		.features-section {
			padding: var(--spacing-lg);
		}
	}
</style>

