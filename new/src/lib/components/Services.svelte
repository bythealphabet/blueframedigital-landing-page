<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import ServiceCard from './ServiceCard.svelte';
	import { servicesVisibility } from '$lib/stores/scrollStore';

	interface Service {
		icon: string;
		title: string;
		description: string;
	}

	const services: Service[] = [
		{
			icon: 'globe',
			title: 'Professional Websites',
			description:
				'Showcase your construction projects with a modern, professional website that builds trust with potential clients.'
		},
		{
			icon: 'image',
			title: 'Project Galleries',
			description:
				'Display your completed projects with beautiful photo galleries that highlight your craftsmanship and expertise.'
		},
		{
			icon: 'phone',
			title: 'Lead Generation',
			description:
				'Convert website visitors into clients with contact forms, quote requests, and clear calls-to-action.'
		},
		{
			icon: 'smartphone',
			title: 'Mobile-Friendly Design',
			description:
				'Your clients browse on their phones. Your website will look perfect on all devices.'
		},
		{
			icon: 'search',
			title: 'Local SEO',
			description: 'Get found by local customers searching for construction services in Curaçao.'
		},
		{
			icon: 'headphones',
			title: 'Ongoing Support',
			description: 'We maintain and update your website so you can focus on building.'
		}
	];

	let servicesVisible = $state(false);
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
				// Update visibility store with intersection ratio for hero fade effect
				servicesVisibility.set(entry.intersectionRatio * 3, 1);
				
				if (entry.isIntersecting) {
					servicesVisible = true;
				}
			},
			{ 
				rootMargin: '0px 0px -15% 0px', 
				threshold: Array.from({ length: 101 }, (_, i) => i / 100) // Track smooth transitions
			}
		);

		if (sectionRef) {
			observer.observe(sectionRef);
		}

		// Initialize Lucide icons
		if (typeof window !== 'undefined' && (window as any).lucide) {
			(window as any).lucide.createIcons();
		}

		return () => {
			if (sectionRef) {
				observer.unobserve(sectionRef);
			}
		};
	});
</script>

<svelte:head>
	<script src="https://unpkg.com/lucide@latest"></script>
</svelte:head>

<section class="services" id="services" bind:this={sectionRef}>
	<div class="container">
		<h2 class="section-title">
			{#if servicesVisible}
				<span
					transition:fly={{
						y: shouldAnimate ? 30 : 0,
						duration: 800,
						easing: quintOut
					}}
				>
					What We Do
				</span>
			{/if}
		</h2>
		<div class="services-grid">
			{#each services as service, i (service.title)}
				<ServiceCard
					title={service.title}
					description={service.description}
					icon={service.icon}
					delay={i * 150}
				/>
			{/each}
		</div>
	</div>
</section>

<style>
	.services {
		min-height: 100vh;
		padding: var(--spacing-3xl) var(--spacing-xl);
		background: var(--background-dark);
		border-bottom: 2px solid var(--primary-blue);
		display: flex;
		align-items: center;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
	}

	.section-title {
		text-align: center;
		font-size: var(--font-size-h2);
		margin-bottom: var(--spacing-3xl);
		color: var(--primary-blue-bright);
		font-weight: 700;
		text-shadow: 0 0 20px rgba(96, 165, 250, 0.3);
	}

	.services-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--spacing-2xl);
	}

	@media (max-width: 768px) {
		.services {
			padding: var(--spacing-2xl) var(--spacing-lg);
		}

		.services-grid {
			grid-template-columns: 1fr;
			gap: var(--spacing-xl);
		}

		.section-title {
			font-size: clamp(2.8rem, 6vw, 3.6rem);
		}
	}
</style>
