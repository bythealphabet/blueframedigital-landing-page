<script lang="ts">
	import { onMount } from 'svelte';

	let isAnimated = $state(false);

	onMount(() => {
		setTimeout(() => {
			isAnimated = true;
		}, 100);
	});
</script>

<section class="hero">
	<div class="hero-content">
		<h1 class="logo hero-headline" class:animated={isAnimated}>
			Blue<span>Frame</span> Digital
		</h1>
		<p class="tagline hero-subheadline" class:animated={isAnimated}>
			Professional Websites for Construction Businesses in Curaçao
		</p>
		<div class="hero-nav">
			<a href="#services" class="nav-button">Our Services</a>
			<a href="#about" class="nav-button">Why Choose Us</a>
			<a href="#contact" class="nav-button primary">Get Started</a>
		</div>
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
		border-bottom: 2px solid var(--primary-blue);
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
		font-size: clamp(1.25rem, 2.5vw, 1.75rem);
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

	.hero-headline {
		opacity: 0;
	}

	.hero-headline.animated {
		animation: fadeIn var(--duration-slow) var(--easing-ease-out) 200ms forwards;
	}

	.hero-subheadline {
		opacity: 0;
	}

	.hero-subheadline.animated {
		animation: fadeIn var(--duration-slow) var(--easing-ease-out) 400ms forwards;
	}

	@media (max-width: 768px) {
		.logo {
			font-size: clamp(2rem, 8vw, 3rem);
		}

		.tagline {
			font-size: clamp(1.1rem, 4vw, 1.4rem);
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
