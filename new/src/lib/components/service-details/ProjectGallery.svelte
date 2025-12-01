<script lang="ts">
	import { fade } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import { onMount } from 'svelte';
	import BeforeAfterSlider from './BeforeAfterSlider.svelte';

	interface ProjectCategory {
		title: string;
		description: string;
		type: 'images' | 'before-after' | 'video';
		// For type='images'
		images?: string[];
		// For type='before-after'
		beforeImage?: string;
		afterImage?: string;
		// For type='video'
		videoUrl?: string;
		videoPoster?: string;
		// Additional metadata
		stats?: { label: string; value: string }[];
	}

	interface Props {
		categories?: ProjectCategory[];
		// Backward compatibility
		galleries?: any[];
		images?: string[];
		text?: string;
	}

	let { categories = [], galleries = [], images = [], text = '' }: Props = $props();

	// State variables
	let currentIndex = $state(0);
	let isAutoPlaying = $state(true);
	let containerElement: HTMLElement;
	let isMobile = $state(false);

	// Default gallery types we can build for construction clients
	const defaultCategories: ProjectCategory[] = [
		{
			title: 'Grid Portfolio Galleries',
			description:
				'We build elegant grid-based galleries that showcase your construction projects beautifully. Perfect for displaying multiple completed projects, allowing visitors to browse your portfolio at a glance. Each image is optimized for fast loading while maintaining stunning quality.',
			type: 'images',
			images: [
				'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
				'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
				'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80'
			],
			stats: [
				{ label: 'Load Time', value: '< 2s' },
				{ label: 'Image Optimization', value: 'Automatic' }
			]
		},
		{
			title: 'Before/After Sliders',
			description:
				'We develop interactive before/after comparison sliders—perfect for renovation contractors. Your clients can drag the slider to see the transformation you created. This powerful visual tool dramatically showcases the value you bring to renovation projects.',
			type: 'before-after',
			beforeImage: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80',
			afterImage: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80',
			stats: [
				{ label: 'Engagement Boost', value: '3x Higher' },
				{ label: 'Mobile Friendly', value: '100%' }
			]
		},
		{
			title: 'Video Showcase Galleries',
			description:
				'We integrate video capabilities into your galleries—ideal for construction time-lapses, project walkthroughs, and client testimonials. Videos play smoothly across all devices, giving potential clients an immersive view of your work process and finished results.',
			type: 'video',
			videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
			videoPoster: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=1200&q=80',
			stats: [
				{ label: 'Video Support', value: 'All Formats' },
				{ label: 'Auto-Optimize', value: 'Yes' }
			]
		},
		{
			title: 'Filterable Project Galleries',
			description:
				'We build advanced filterable galleries that let visitors search and filter by project type, location, year, or custom tags. Perfect for construction companies with diverse portfolios—help clients find exactly the type of project they\'re interested in.',
			type: 'images',
			images: [
				'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
				'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
				'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80'
			],
			stats: [
				{ label: 'Filter Options', value: 'Unlimited' },
				{ label: 'Search Speed', value: 'Instant' }
			]
		}
	];

	// Handle backward compatibility and determine which data to use
	const displayCategories = $derived.by(() => {
		if (categories.length > 0) {
			return categories;
		}

		// Legacy support for old 'galleries' format
		if (galleries.length > 0) {
			return galleries.map((g: any) => ({
				title: g.title || 'Project',
				description: g.description || '',
				type: 'images' as const,
				images: [g.image],
				stats: []
			}));
		}

		// Legacy support for old 'images' format
		if (images.length > 0) {
			return [
				{
					title: 'Project Gallery',
					description: text || 'Our construction projects showcase',
					type: 'images' as const,
					images: images,
					stats: []
				}
			];
		}

		return defaultCategories;
	});

	const currentCategory = $derived(displayCategories[currentIndex]);
	const shouldAnimate = !prefersReducedMotion.current;

	// Derived value for max images based on screen size
	const maxImages = $derived(isMobile ? 2 : 3);

	onMount(() => {
		// Check initial screen size
		const checkMobile = () => {
			isMobile = window.innerWidth <= 768;
		};
		
		checkMobile();
		window.addEventListener('resize', checkMobile);

		const interval = setInterval(() => {
			if (isAutoPlaying && displayCategories.length > 1) {
				currentIndex = (currentIndex + 1) % displayCategories.length;
			}
		}, 7000);

		// Initialize Lucide icons
		if (typeof window !== 'undefined' && (window as any).lucide) {
			(window as any).lucide.createIcons();
		}

		return () => {
			clearInterval(interval);
			window.removeEventListener('resize', checkMobile);
		};
	});

	function selectCategory(index: number) {
		currentIndex = index;
		isAutoPlaying = false;
		// Resume auto-play after 15 seconds
		setTimeout(() => {
			isAutoPlaying = true;
		}, 15000);
	}
</script>

<div class="project-gallery" bind:this={containerElement}>
	<!-- Category Content Display -->
	{#key currentIndex}
		<div
			class="category-content"
			transition:fade={{ duration: shouldAnimate ? 400 : 0 }}
		>
			<div class="category-header">
				<p class="category-description">{currentCategory.description}</p>
			</div>

			<!-- Content based on type -->
			<div class="category-showcase">
				{#if currentCategory.type === 'images' && currentCategory.images}
					<div class="images-grid">
						{#each currentCategory.images.slice(0, maxImages) as image, i}
							<div class="image-item">
								<img src={image} alt="Project {i + 1}" loading="lazy" />
							</div>
						{/each}
					</div>
				{:else if currentCategory.type === 'before-after' && currentCategory.beforeImage && currentCategory.afterImage}
					<div class="before-after-showcase">
						<BeforeAfterSlider
							before={currentCategory.beforeImage}
							after={currentCategory.afterImage}
						/>
					</div>
				{:else if currentCategory.type === 'video' && currentCategory.videoUrl}
					<div class="video-showcase">
						<video
							controls
							poster={currentCategory.videoPoster}
							preload="metadata"
							class="project-video"
						>
							<source src={currentCategory.videoUrl} type="video/mp4" />
							<track kind="captions" />
							Your browser does not support the video tag.
						</video>
					</div>
				{/if}
			</div>

			<!-- Stats -->
			{#if currentCategory.stats && currentCategory.stats.length > 0}
				<!-- <div class="category-stats" transition:fade={{ duration: shouldAnimate ? 300 : 0 }}>
					{#each currentCategory.stats as stat}
						<div class="stat-item">
							<div class="stat-value">{stat.value}</div>
							<div class="stat-label">{stat.label}</div>
						</div>
					{/each}
				</div> -->
			{/if}

			<!-- Controls -->
			{#if displayCategories.length > 1}
				<div class="controls">
					<div class="dots">
						{#each displayCategories as category, i}
							<button
								class="dot"
								class:active={i === currentIndex}
								onclick={() => selectCategory(i)}
								aria-label="Go to {category.title}"
								title={category.title}
							>
								<span class="dot-inner"></span>
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/key}
</div>

<style lang="scss">
	.project-gallery {
		width: 100%;
		padding: var(--spacing-md);
        display: grid;
        grid-template-columns: subgrid;
        grid-template-rows: subgrid;


		grid-column: 1 / -1;
		grid-row: 1 / -1;
		min-height: 0;
		overflow: hidden;

        & > * {
            grid-column: 1 / -1;
            grid-row: 1 / -1;
        }

		@media (max-width: 768px) {
			padding: var(--spacing-sm);
		}
	}

	.controls {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-md);
		margin-top: var(--spacing-lg);
		padding-top: var(--spacing-lg);
		border-top: 1px solid rgba(96, 165, 250, 0.2);
        grid-column: 1 / -1;
        grid-row: 3;
	}

	.dots {
		display: flex;
		gap: var(--spacing-md);
		padding: var(--spacing-sm) var(--spacing-lg);
		background: rgba(15, 23, 42, 0.8);
		border-radius: 999px;
		border: 1px solid var(--primary-blue);
		backdrop-filter: blur(10px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
	}

	.dot {
		position: relative;
		width: 16px;
		height: 16px;
		padding: 0;
		background: transparent;
		border: none;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

		&:hover .dot-inner {
			background: var(--primary-blue-light);
			transform: scale(1.3);
		}

		&:focus {
			outline: 2px solid var(--primary-blue-bright);
			outline-offset: 3px;
			border-radius: 50%;
		}
	}

	.dot-inner {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		background: rgba(96, 165, 250, 0.4);
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.dot.active .dot-inner {
		background: var(--primary-blue-bright);
		transform: scale(1.5);
		box-shadow: 0 0 16px rgba(96, 165, 250, 0.8);
	}

	.category-content {
		flex: 1;
		max-width: 1200px;
		width: 100%;
        height: 100%;
		align-self: center;
		padding: var(--spacing-xl);
		background: rgba(15, 23, 42, 0.6);
		border: 1px solid var(--primary-blue);
		border-radius: var(--radius-sm);
		backdrop-filter: blur(10px);
		min-height: 0;
		overflow-y: auto;

        display: grid;
        grid-template-columns: 1fr; 
        grid-template-rows: auto minmax(0, 1fr) auto;
		gap: var(--spacing-lg);

        grid-column: 1 / -1;
        grid-row: 1 / -1;

		@media (max-width: 768px) {
			padding: var(--spacing-md);
			gap: var(--spacing-md);
		}
	}

	.category-header {
		text-align: center;
		flex-shrink: 0;
        grid-column: 1 / -1;
        grid-row: 1;
	}

	.category-title {
		color: var(--primary-blue-bright);
		font-size: var(--font-size-xl);
		font-weight: 700;
		margin: 0 0 var(--spacing-sm) 0;
		text-shadow: 0 0 20px rgba(96, 165, 250, 0.3);

		@media (max-width: 768px) {
			font-size: var(--font-size-lg);
		}
	}

	.category-description {
		color: var(--text-secondary);
		font-size: var(--font-size-base);
		line-height: var(--line-height-relaxed);
		margin: 0 auto;
		max-width: 900px;
		word-wrap: break-word;
		overflow-wrap: break-word;

		@media (max-width: 768px) {
			font-size: var(--font-size-sm);
		}
	}

	.category-showcase {
		width: 100%;
		max-width: 100%;
		flex-shrink: 0;
		overflow: hidden;

        grid-column: 1 / -1;
        grid-row: 2;
        align-self: start;
	}

	.images-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--spacing-md);

		@media (max-width: 768px) {
			grid-template-columns: 1fr;
			gap: var(--spacing-sm);
		}
	}

	.image-item {
		aspect-ratio: 4 / 3;
		border-radius: var(--radius-sm);
		overflow: hidden;
		border: 2px solid var(--primary-blue);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
		transition: all 0.3s ease;

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 8px 24px rgba(96, 165, 250, 0.3);
			border-color: var(--primary-blue-bright);
		}

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			display: block;
		}
	}

	.before-after-showcase,
	.video-showcase {
		width: 100%;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.project-video {
		width: 100%;
		border-radius: var(--radius-sm);
		border: 2px solid var(--primary-blue-bright);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
		background: black;
		max-height: 450px;
		display: block;
		object-fit: contain;

		@media (max-width: 768px) {
			max-height: 280px; // Increased from 250px for better visibility
		}

		@media (min-width: 769px) {
			max-height: 550px; // Increased from 500px to accommodate controls
		}
	}

	.category-stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: var(--spacing-md);
		flex-shrink: 0;
	}

	.stat-item {
		text-align: center;
		padding: var(--spacing-md);
		background: rgba(96, 165, 250, 0.05);
		border: 1px solid rgba(96, 165, 250, 0.2);
		border-radius: var(--radius-sm);
		transition: all 0.3s ease;

		&:hover {
			background: rgba(96, 165, 250, 0.1);
			border-color: var(--primary-blue);
			transform: translateY(-2px);
		}
	}

	.stat-value {
		font-size: var(--font-size-xl);
		font-weight: 700;
		color: var(--primary-blue-bright);
		margin-bottom: var(--spacing-xs);
		text-shadow: 0 0 20px rgba(96, 165, 250, 0.3);

		@media (max-width: 768px) {
			font-size: var(--font-size-lg);
		}
	}

	.stat-label {
		color: var(--text-tertiary);
		font-size: var(--font-size-sm);
	}

	// Responsive breakpoints - Progressive enhancement for different viewport sizes

	// Very small screens - Hide stats, reduce spacing
	@media (max-width: 374px) {
		.category-stats {
			display: none; // Hide stats to save space
		}

		.category-title {
			font-size: var(--font-size-base);
			margin-bottom: var(--spacing-xs);
		}

		.category-description {
			font-size: var(--font-size-xs);
			line-height: 1.4;
			// Limit to 3 lines instead of 2 for better readability
			display: -webkit-box;
			-webkit-line-clamp: 3;
			line-clamp: 3;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}

		.category-content {
			padding: var(--spacing-sm);
			gap: var(--spacing-sm);
		}
	}

	// Small screens (iPhone SE)
	@media (min-width: 375px) and (max-width: 389px) {
		.category-title {
			font-size: var(--font-size-lg);
		}

		.category-description {
			font-size: var(--font-size-sm);
			line-height: 1.4;
			// Limit to 3 lines
			display: -webkit-box;
			-webkit-line-clamp: 3;
			line-clamp: 3;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}

		.stat-value {
			font-size: var(--font-size-lg);
		}

		.stat-label {
			font-size: var(--font-size-xs);
		}

		.category-stats {
			gap: var(--spacing-sm);
		}
	}

	// Medium screens (iPhone 12, tablets)
	@media (min-width: 390px) and (max-width: 768px) {
		.category-description {
			font-size: var(--font-size-base);
			// Limit to 4 lines on tablets
			display: -webkit-box;
			-webkit-line-clamp: 4;
			line-clamp: 4;
			-webkit-box-orient: vertical;
			overflow: hidden;
		}
	}

	// Desktop - show full text without line clamping (769px+)
	@media (min-width: 769px) {
		.category-description {
			// Remove any line clamping on desktop to show full text
			display: block;
			-webkit-line-clamp: unset;
			line-clamp: unset;
			-webkit-box-orient: unset;
			overflow: visible;
		}
	}
</style>
