<script lang="ts">
	import { onMount } from 'svelte';
	import { Spring } from 'svelte/motion';

	let scrollY = $state(0);

	// Spring for scroll progress (smoother than regular transitions!)
	const scrollProgress = new Spring(0, {
		stiffness: 0.1,
		damping: 0.5
	});

	function updateProgress() {
		const windowHeight = window.innerHeight;
		const documentHeight = document.documentElement.scrollHeight;
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
		scrollProgress.target = scrollPercent;
	}

	onMount(() => {
		window.addEventListener('scroll', updateProgress, { passive: true });
		updateProgress();

		return () => {
			window.removeEventListener('scroll', updateProgress);
		};
	});
</script>

<div class="scroll-progress" style="width: {scrollProgress.current}%"></div>

<style>
	.scroll-progress {
		position: fixed;
		top: 0;
		left: 0;
		height: 4px;
		background: linear-gradient(
			90deg,
			var(--primary-blue),
			var(--primary-blue-light),
			var(--primary-blue-bright)
		);
		z-index: 9999;
		will-change: width;
	}
</style>
