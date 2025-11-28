<script lang="ts">
	const currentYear = new Date().getFullYear();
</script>

<footer>
	<p>&copy; {currentYear} Blue Frame Digital. All rights reserved.</p>
</footer>

<style>
	footer {
		padding: var(--spacing-xl);
		background: var(--background-dark-alt);
		color: var(--text-tertiary);
		text-align: center;
		border-top: 2px solid var(--primary-blue);
	}
</style>
