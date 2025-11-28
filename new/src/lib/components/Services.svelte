<script lang="ts">
	import { onMount } from 'svelte';

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

	let animatedElements = $state<boolean[]>([]);
	let sectionRef: HTMLElement;

	onMount(() => {
		animatedElements = services.map(() => false);

		if (!('IntersectionObserver' in window)) {
			animatedElements = services.map(() => true);
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const cards = entry.target.querySelectorAll('.service-card');
						cards.forEach((card, index) => {
							setTimeout(() => {
								animatedElements[index] = true;
							}, index * 150);
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
		<h2 class="section-title">What We Do</h2>
		<div class="services-grid">
			{#each services as service, i (service.title)}
				<div class="service-card" class:animated={animatedElements[i]}>
					<div class="service-icon">
						<i data-lucide={service.icon} width="48" height="48"></i>
					</div>
					<h3>{service.title}</h3>
					<p>{service.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.services {
		padding: var(--section-padding) var(--spacing-lg);
		background: var(--background-dark);
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

	.services-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--spacing-xl);
	}

	.service-card {
		background: var(--background-card);
		padding: var(--spacing-xl);
		border: 2px solid var(--primary-blue);
		border-radius: var(--radius-sm);
		transition: var(--transition-normal);
		position: relative;
		overflow: hidden;
		opacity: 0;
		transform: translateY(40px);
	}

	.service-card.animated {
		opacity: 1;
		transform: translateY(0);
	}

	.service-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: repeating-linear-gradient(
			45deg,
			transparent,
			transparent 10px,
			rgba(30, 58, 138, 0.03) 10px,
			rgba(30, 58, 138, 0.03) 20px
		);
		pointer-events: none;
	}

	.service-card:hover {
		border-color: var(--primary-blue-light);
		box-shadow: 0 0 30px rgba(37, 99, 235, 0.3);
		transform: translateY(-8px);
	}

	.service-icon {
		margin-bottom: var(--spacing-md);
		color: var(--primary-blue-bright);
		transition: var(--transition-normal);
	}

	.service-card:hover .service-icon {
		color: var(--primary-blue-light);
		transform: scale(1.1);
	}

	.service-card h3 {
		font-size: var(--font-size-h3);
		margin-bottom: var(--spacing-md);
		color: var(--text-secondary);
	}

	.service-card p {
		color: var(--text-tertiary);
		line-height: var(--line-height-relaxed);
	}

	@media (max-width: 768px) {
		.services {
			padding: var(--section-padding-mobile) var(--spacing-lg);
		}

		.services-grid {
			grid-template-columns: 1fr;
			gap: var(--spacing-lg);
		}

		.section-title {
			font-size: clamp(1.75rem, 6vw, 2.25rem);
		}
	}
</style>
