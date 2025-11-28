<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	const paragraphs = [
		"We understand your world because we've lived it. With a decade of hands-on experience in construction—from swinging hammers as a carpenter to reading blueprints as a drafter, managing crews as a foreman, and running projects as a contractor—we know the challenges you face every day.",
		"For the past 8+ years, we've applied that same dedication to mastering web development. This unique combination means we don't just build websites—we build digital tools that speak your language and solve your real business problems.",
		"We know that construction professionals don't have time to waste on complicated technology. You need a website that works as hard as you do: one that showcases your craftsmanship, generates quality leads, and positions you as the professional choice in your market.",
		"Whether you're a general contractor looking to attract bigger projects, a specialized tradesperson wanting to stand out from the competition, or a growing construction company ready to professionalize your brand—we'll build you a website that gets results."
	];

	let aboutVisible = $state(false);
	let sectionRef: HTMLElement;

	// Check if animations should be reduced
	const prefersReducedMotion =
		typeof window !== 'undefined'
			? window.matchMedia('(prefers-reduced-motion: reduce)').matches
			: false;
	const shouldAnimate = !prefersReducedMotion;

	onMount(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					aboutVisible = true;
				}
			},
			{ rootMargin: '0px 0px -15% 0px', threshold: 0.1 }
		);

		if (sectionRef) {
			observer.observe(sectionRef);
		}

		return () => {
			if (sectionRef) {
				observer.unobserve(sectionRef);
			}
		};
	});
</script>

<section class="about" id="about" bind:this={sectionRef}>
	<div class="container">
		<h2 class="section-title">
			{#if aboutVisible}
				<span
					transition:fade={{
						duration: 800
					}}
				>
					Why Construction Businesses Choose Us
				</span>
			{/if}
		</h2>
		<div class="about-content">
			{#if aboutVisible}
				{#each paragraphs as paragraph, i (i)}
					<p
						transition:fly={{
							x: shouldAnimate ? (i % 2 === 0 ? -60 : 60) : 0,
							duration: 800,
							delay: 200 + i * 200,
							easing: quintOut
						}}
					>
						{paragraph}
					</p>
				{/each}
			{/if}
		</div>
	</div>
</section>

<style>
	.about {
		padding: var(--section-padding) var(--spacing-lg);
		background: var(--background-dark-alt);
		border-bottom: 2px solid var(--primary-blue);
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
	}

	.section-title {
		text-align: center;
		font-size: var(--font-size-h2);
		margin-bottom: var(--spacing-3xl);
		color: var(--primary-blue-bright);
		font-weight: 700;
		text-shadow: 0 0 20px rgba(96, 165, 250, 0.3);
	}

	.about-content {
		max-width: 900px;
		margin: 0 auto;
		text-align: center;
	}

	.about-content p {
		font-size: var(--font-size-body);
		color: var(--text-tertiary);
		line-height: var(--line-height-relaxed);
		margin-bottom: var(--spacing-lg);
	}

	@media (max-width: 768px) {
		.about {
			padding: var(--section-padding-mobile) var(--spacing-lg);
		}

		.section-title {
			font-size: clamp(2.8rem, 6vw, 3.6rem);
		}
	}
</style>
