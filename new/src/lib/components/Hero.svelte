<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, scale } from 'svelte/transition';
	import { quintOut, elasticOut, backOut } from 'svelte/easing';
	import { servicesVisibility } from '$lib/stores/scrollStore';

	let heroVisible = $state(false);
	let scrollY = $state(0);
	let heroOpacity = $state(1);

	// Check if animations should be reduced
	const prefersReducedMotion =
		typeof window !== 'undefined'
			? window.matchMedia('(prefers-reduced-motion: reduce)').matches
			: false;
	const shouldAnimate = !prefersReducedMotion;

	onMount(() => {
		heroVisible = true;

		// Subscribe to services visibility to fade hero out
		const unsubscribe = servicesVisibility.subscribe((visibility) => {
			heroOpacity = 1 - visibility;
		});

		return unsubscribe;
	});
</script>

<svelte:window bind:scrollY />

<section class="hero" style="transform: translateY({scrollY * 0.3}px); opacity: {heroOpacity};">
	<div class="hero-content">
		{#if heroVisible}
			<h1
				class="logo hero-headline"
				transition:fly={{
					y: shouldAnimate ? 50 : 0,
					duration: 1000,
					delay: 200,
					easing: quintOut
				}}
			>
				Blue<span>Frame</span> Digital
			</h1>

			<p
				class="tagline hero-subheadline"
				transition:fly={{
					y: shouldAnimate ? 30 : 0,
					duration: 800,
					delay: 500,
					easing: quintOut
				}}
			>
				Professional Websites for Construction Businesses in Curaçao
			</p>

			<div class="hero-nav">
				<a
					href="#services"
					class="nav-button"
					transition:fly={{
						y: shouldAnimate ? 20 : 0,
						duration: 600,
						delay: 700,
						easing: backOut
					}}
				>
					Our Services
				</a>
				<a
					href="#about"
					class="nav-button"
					transition:fly={{
						y: shouldAnimate ? 20 : 0,
						duration: 600,
						delay: 850,
						easing: backOut
					}}
				>
					Why Choose Us
				</a>
				<a
					href="#contact"
					class="nav-button primary"
					transition:scale={{
						duration: 800,
						delay: 1000,
						easing: elasticOut,
						start: shouldAnimate ? 0.3 : 1
					}}
				>
					Get Started
				</a>
			</div>
		{/if}
	</div>
</section>

<style>
	.hero {
		min-height: 100vh;
		background: var(--background-dark-alt);
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: var(--spacing-lg);
		position: relative;
		overflow: hidden;
		/* border-bottom: 2rem solid var(--primary-blue); */
		will-change: transform, opacity;
		transition: opacity 600ms ease-out;
	}

	.hero::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: repeating-linear-gradient(
				0deg,
				transparent,
				transparent 2px,
				rgba(30, 58, 138, 0.1) 2px,
				rgba(30, 58, 138, 0.1) 4px
			),
			repeating-linear-gradient(
				90deg,
				transparent,
				transparent 2px,
				rgba(30, 58, 138, 0.1) 2px,
				rgba(30, 58, 138, 0.1) 4px
			);
		background-size: 50px 50px;
	}

	.hero-content {
		max-width: 900px;
		position: relative;
		z-index: 1;
	}

	.logo {
		font-size: var(--font-size-hero);
		font-weight: 700;
		color: var(--primary-blue-bright);
		margin-bottom: var(--spacing-md);
		letter-spacing: 2px;
		text-shadow: 0 0 20px rgba(96, 165, 250, 0.5);
	}

	.logo span {
		color: var(--primary-blue-pale);
	}

	.tagline {
		font-size: clamp(2rem, 2.5vw, 2.8rem);
		color: var(--text-secondary);
		margin-bottom: var(--spacing-xl);
		font-weight: 300;
		line-height: var(--line-height-relaxed);
	}

	.hero-nav {
		display: flex;
		gap: var(--spacing-md);
		justify-content: center;
		flex-wrap: wrap;
		margin-top: var(--spacing-xl);
	}

	.nav-button {
		display: inline-block;
		padding: 0.75rem 1.75rem;
		background: transparent;
		color: var(--primary-blue-bright);
		text-decoration: none;
		border: 2px solid var(--primary-blue);
		border-radius: var(--radius-sm);
		font-weight: 600;
		font-size: var(--font-size-body);
		transition: var(--transition-normal);
		cursor: pointer;
		box-shadow: 0 0 15px rgba(30, 58, 138, 0.3);
		position: relative;
		overflow: hidden;
	}

	.nav-button::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0;
		height: 0;
		border-radius: 50%;
		background: rgba(30, 58, 138, 0.2);
		transform: translate(-50%, -50%);
		transition: width 0.6s, height 0.6s;
	}

	.nav-button:hover::before {
		width: 300px;
		height: 300px;
	}

	.nav-button:hover {
		background: var(--primary-blue);
		box-shadow: 0 0 25px rgba(30, 58, 138, 0.6);
		transform: translateY(-2px) scale(1.05);
	}

	.nav-button.primary {
		background: var(--primary-blue);
		box-shadow: 0 0 20px rgba(30, 58, 138, 0.4);
	}

	.nav-button.primary:hover {
		background: var(--primary-blue-light);
		box-shadow: 0 0 30px rgba(37, 99, 235, 0.6);
	}


	@media (max-width: 768px) {
		.logo {
			font-size: clamp(3.2rem, 8vw, 4.8rem);
		}

		.tagline {
			font-size: clamp(1.76rem, 4vw, 2.24rem);
		}

		.hero-nav {
			flex-direction: column;
			width: 100%;
		}

		.nav-button {
			width: 100%;
			text-align: center;
		}
	}
</style>
