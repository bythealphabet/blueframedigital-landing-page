<script lang="ts">
	import { onMount } from 'svelte';

	let name = $state('');
	let email = $state('');
	let phone = $state('');
	let message = $state('');
	let isSubmitting = $state(false);
	let formMessage = $state('');
	let formMessageType = $state<'success' | 'error' | ''>('');

	async function handleSubmit(e: Event) {
		e.preventDefault();

		isSubmitting = true;
		formMessage = '';
		formMessageType = '';

		const formData = {
			name,
			email,
			phone,
			message
		};

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			const data = await response.json();

			if (response.ok) {
				formMessage = 'Thank you! Your message has been sent successfully.';
				formMessageType = 'success';
				name = '';
				email = '';
				phone = '';
				message = '';
			} else {
				formMessage = data.error || 'Something went wrong. Please try again.';
				formMessageType = 'error';
			}
		} catch (error) {
			formMessage = 'Network error. Please try again later.';
			formMessageType = 'error';
		} finally {
			isSubmitting = false;
		}
	}

	onMount(() => {
		// Initialize Lucide icons
		if (typeof window !== 'undefined' && (window as any).lucide) {
			(window as any).lucide.createIcons();
		}
	});
</script>

<svelte:head>
	<script src="https://unpkg.com/lucide@latest"></script>
</svelte:head>

<section class="contact" id="contact">
	<div class="container">
		<h2>Ready to Grow Your Construction Business?</h2>
		<p>Let's build a website that showcases your work and brings in more clients.</p>

		<form class="contact-form" onsubmit={handleSubmit}>
			<div class="form-group">
				<input type="text" bind:value={name} placeholder="Your Name" required />
			</div>
			<div class="form-group">
				<input type="email" bind:value={email} placeholder="Your Email" required />
			</div>
			<div class="form-group">
				<input type="tel" bind:value={phone} placeholder="Your Phone (optional)" />
			</div>
			<div class="form-group">
				<textarea bind:value={message} rows="5" placeholder="Tell us about your project..." required
				></textarea>
			</div>
			<button type="submit" class="contact-button" disabled={isSubmitting}>
				{#if isSubmitting}
					Sending...
				{:else}
					Send Message
				{/if}
			</button>
			{#if formMessage}
				<div class="form-message {formMessageType}">
					{formMessage}
				</div>
			{/if}
		</form>

		<div class="contact-info">
			<div class="contact-item">
				<i data-lucide="map-pin"></i>
				<span>Willemstad, Curaçao</span>
			</div>
		</div>
	</div>
</section>

<style>
	.contact {
		padding: var(--section-padding) var(--spacing-lg);
		background: var(--background-dark);
		text-align: center;

		grid-column: 1 / -1;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
	}

	.contact h2 {
		font-size: var(--font-size-h2);
		margin-bottom: var(--spacing-md);
		color: var(--primary-blue-bright);
		font-weight: 700;
		text-shadow: 0 0 20px rgba(96, 165, 250, 0.3);
	}

	.contact > .container > p {
		font-size: var(--font-size-body);
		margin-bottom: var(--spacing-2xl);
		color: var(--text-secondary);
	}

	.contact-form {
		max-width: 600px;
		margin: var(--spacing-2xl) auto;
		text-align: left;
	}

	.form-group {
		margin-bottom: var(--spacing-lg);
	}

	.contact-form input,
	.contact-form textarea {
		width: 100%;
		padding: var(--spacing-md);
		background: var(--background-card);
		border: 2px solid var(--primary-blue);
		border-radius: var(--radius-sm);
		color: var(--text-primary);
		font-family: var(--font-body);
		font-size: var(--font-size-body);
		transition: var(--transition-normal);
	}

	.contact-form input:focus,
	.contact-form textarea:focus {
		outline: none;
		border-color: var(--primary-blue-light);
		box-shadow: 0 0 15px rgba(37, 99, 235, 0.3);
		background: var(--background-card);
	}

	.contact-form input::placeholder,
	.contact-form textarea::placeholder {
		color: var(--text-light);
	}

	.contact-form textarea {
		resize: vertical;
		min-height: 150px;
	}

	.contact-button {
		display: inline-block;
		padding: 0.75rem 1.75rem;
		background: var(--primary-blue);
		color: var(--text-primary);
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
		width: 100%;
	}

	.contact-button::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0;
		height: 0;
		border-radius: 50%;
		background: rgba(30, 58, 138, 0.2);
		transform: translate(-50%, -50%);
		transition:
			width 0.6s,
			height 0.6s;
	}

	.contact-button:hover::before {
		width: 300px;
		height: 300px;
	}

	.contact-button:hover {
		background: var(--primary-blue-light);
		box-shadow: 0 0 25px rgba(30, 58, 138, 0.6);
		transform: translateY(-2px) scale(1.05);
	}

	.contact-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	.contact-button:disabled:hover {
		transform: none;
	}

	.form-message {
		margin-top: var(--spacing-md);
		padding: var(--spacing-md);
		border-radius: var(--radius-md);
		text-align: center;
		font-weight: 600;
	}

	.form-message.success {
		background: rgba(34, 197, 94, 0.1);
		border: 2px solid #22c55e;
		color: #22c55e;
	}

	.form-message.error {
		background: rgba(239, 68, 68, 0.1);
		border: 2px solid #ef4444;
		color: #ef4444;
	}

	.contact-info {
		display: flex;
		justify-content: center;
		gap: var(--spacing-xl);
		flex-wrap: wrap;
		margin-top: var(--spacing-2xl);
	}

	.contact-item {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		font-size: var(--font-size-body);
		color: var(--text-tertiary);
	}

	.contact-item :global(svg) {
		color: var(--primary-blue-bright);
	}

	@media (max-width: 768px) {
		.contact {
			padding: var(--section-padding-mobile) var(--spacing-lg);
		}

		.contact-info {
			flex-direction: column;
			gap: var(--spacing-md);
		}
	}
</style>
