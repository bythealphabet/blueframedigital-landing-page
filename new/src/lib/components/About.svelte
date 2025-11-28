<script lang="ts">
	import { onMount } from 'svelte';

	const paragraphs = [
		"We understand your world because we've lived it. With a decade of hands-on experience in construction—from swinging hammers as a carpenter to reading blueprints as a drafter, managing crews as a foreman, and running projects as a contractor—we know the challenges you face every day.",
		"For the past 8+ years, we've applied that same dedication to mastering web development. This unique combination means we don't just build websites—we build digital tools that speak your language and solve your real business problems.",
		"We know that construction professionals don't have time to waste on complicated technology. You need a website that works as hard as you do: one that showcases your craftsmanship, generates quality leads, and positions you as the professional choice in your market.",
		"Whether you're a general contractor looking to attract bigger projects, a specialized tradesperson wanting to stand out from the competition, or a growing construction company ready to professionalize your brand—we'll build you a website that gets results."
	];

	let animatedParagraphs = $state<boolean[]>([]);
	let sectionRef: HTMLElement;

	onMount(() => {
		animatedParagraphs = paragraphs.map(() => false);

		if (!('IntersectionObserver' in window)) {
			animatedParagraphs = paragraphs.map(() => true);
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const paras = entry.target.querySelectorAll('.about-paragraph');
						paras.forEach((para, index) => {
							setTimeout(() => {
								animatedParagraphs[index] = true;
							}, index * 200);
						});
						observer.unobserve(entry.target);
					}
				});
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
		<h2 class="section-title">Why Construction Businesses Choose Us</h2>
		<div class="about-content">
			{#each paragraphs as paragraph, i (i)}
				<p class="about-paragraph" class:animated={animatedParagraphs[i]}>
					{paragraph}
				</p>
			{/each}
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

	.about-paragraph {
		font-size: var(--font-size-body);
		color: var(--text-tertiary);
		line-height: var(--line-height-relaxed);
		margin-bottom: var(--spacing-lg);
		opacity: 0;
		transform: translateX(-60px);
		transition:
			opacity 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94),
			transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	.about-paragraph.animated {
		opacity: 1;
		transform: translateX(0);
	}

	.about-paragraph:nth-child(even) {
		transform: translateX(60px);
	}

	.about-paragraph:nth-child(even).animated {
		transform: translateX(0);
	}

	@media (max-width: 768px) {
		.about {
			padding: var(--section-padding-mobile) var(--spacing-lg);
		}

		.section-title {
			font-size: clamp(1.75rem, 6vw, 2.25rem);
		}
	}
</style>
