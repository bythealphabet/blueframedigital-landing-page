<script lang="ts">
	import { onMount } from 'svelte';

	let progress = $state(0);

	function updateProgress() {
		const windowHeight = window.innerHeight;
		const documentHeight = document.documentElement.scrollHeight;
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
		progress = scrollPercent;
	}

	onMount(() => {
		window.addEventListener('scroll', updateProgress, { passive: true });
		updateProgress();

		return () => {
			window.removeEventListener('scroll', updateProgress);
		};
	});
</script>

<div class="scroll-progress" style="width: {progress}%"></div>

<style>
	.scroll-progress {
		position: fixed;
		top: 0;
		left: 0;
		height: 3px;
		background: linear-gradient(90deg, var(--primary-blue), var(--primary-blue-light));
		z-index: 9999;
		transition: width 0.1s ease-out;
	}
</style>
