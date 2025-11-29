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
				servicesVisibility.set(entry.intersectionRatio * 3);

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

<section class="services base-grid" id="services" bind:this={sectionRef}>
	<div class="container base-grid">
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
		--top-space: 30rem;
		--bottom-space: 30rem;

		min-height: 100vh;
		background: var(--background-dark);
		grid-template-rows: var(--top-space) auto var(--bottom-space);

		grid-column: 1 / -1;

		@media (min-width: 767px) {
			--top-space: 15rem;
			--bottom-space: 15rem;
		}
	}

	.container {
		grid-template-rows: minmax(5rem, 10rem) auto;
		grid-column: 1 / -1;
		grid-row: 2;

		@media (min-width: 767px) {
			grid-template-rows: var(--top-space) auto;
			grid-row: 1 / span 2;
		}
	}

	.section-title {
		text-align: center;
		font-size: var(--font-size-h2);
		margin-bottom: var(--spacing-3xl);
		color: var(--primary-blue-bright);
		font-weight: 700;
		text-shadow: 0 0 20px rgba(96, 165, 250, 0.3);

		grid-column: 1 / -1;
		justify-self: center;
		align-self: center;
	}

	.services-grid {
		--card-size: 30rem;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(var(--card-size), 1fr));
		grid-template-rows: repeat(auto-fit, 30rem);
		gap: var(--spacing-2xl);

		grid-column: 2 / -2;
		@media (min-width: 1211px) {
			--card-size: 35rem;
		}

		@media (min-width: 1550px) {
			grid-column: 3 / -3;
		}
	}
</style>
