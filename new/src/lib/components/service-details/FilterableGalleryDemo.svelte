<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { createEventDispatcher } from 'svelte';

	// Sample projects with categories
	const projects = [
		{
			id: 1,
			title: 'Modern Office',
			image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
			tags: ['commercial', 'office', '2024']
		},
		{
			id: 2,
			title: 'Luxury Residence',
			image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
			tags: ['residential', 'luxury', '2023']
		},
		{
			id: 3,
			title: 'Retail Space',
			image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
			tags: ['commercial', 'retail', '2024']
		}
	];

	// Available filter tags
	const filterTags = [
		{ label: 'Commercial', value: 'commercial' },
		{ label: 'Residential', value: 'residential' },
		{ label: 'Luxury', value: 'luxury' },
		{ label: '2024', value: '2024' }
	];

	let searchQuery = $state('');
	let activeTag = $state<string | null>(null);

	const dispatch = createEventDispatcher();

	function notifyInteraction() {
		dispatch('userInteraction');
	}

	// Filtered projects based on search and tags
	const filteredProjects = $derived.by(() => {
		let filtered = projects;

		// Filter by active tag
		if (activeTag !== null) {
			const tagToFilter = activeTag;
			filtered = filtered.filter(project => 
				project.tags.includes(tagToFilter)
			);
		}

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(project =>
				project.title.toLowerCase().includes(query) ||
				project.tags.some(tag => tag.toLowerCase().includes(query))
			);
		}

		return filtered;
	});

	function toggleTag(tagValue: string) {
		notifyInteraction();
		if (activeTag === tagValue) {
			activeTag = null;
		} else {
			activeTag = tagValue;
			searchQuery = ''; // Clear search when clicking a tag
		}
	}

	function handleSearchInput(e: Event) {
		notifyInteraction();
		const target = e.target as HTMLInputElement;
		searchQuery = target.value;
		activeTag = null; // Clear active tag when typing
	}
</script>

<div class="filterable-demo">
	<!-- Search Input -->
	<div class="search-container">
		<div class="search-wrapper">
			<svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<circle cx="11" cy="11" r="8"></circle>
				<path d="m21 21-4.35-4.35"></path>
			</svg>
			<input
				type="text"
				placeholder="Search projects..."
				value={searchQuery}
				oninput={handleSearchInput}
				class="search-input"
			/>
		</div>
		<p class="search-hint">Try searching or click a tag below</p>
	</div>

	<!-- Filter Tags -->
	<div class="tags-container">
		{#each filterTags as tag}
			<button
				class="filter-tag"
				class:active={activeTag === tag.value}
				onclick={() => toggleTag(tag.value)}
			>
				{tag.label}
			</button>
		{/each}
	</div>

	<!-- Results Info -->
	<div class="results-info">
		<span class="results-count">{filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found</span>
	</div>

	<!-- Project Grid -->
	<div class="projects-grid">
		{#each filteredProjects as project (project.id)}
			<div
				class="project-card"
				in:fly={{ y: 20, duration: 400, delay: 100, easing: quintOut }}
				out:fade={{ duration: 200 }}
			>
				<div class="project-image">
					<img src={project.image} alt={project.title} />
				</div>
				<div class="project-info">
					<h4 class="project-title">{project.title}</h4>
					<div class="project-tags">
						{#each project.tags as tag}
							<span class="tag">{tag}</span>
						{/each}
					</div>
				</div>
			</div>
		{/each}
	</div>

	{#if filteredProjects.length === 0}
		<div class="no-results" transition:fade={{ duration: 300 }}>
			<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<circle cx="11" cy="11" r="8"></circle>
				<path d="m21 21-4.35-4.35"></path>
			</svg>
			<p>No projects match your search</p>
			<button class="reset-btn" onclick={() => { searchQuery = ''; activeTag = null; }}>
				Clear filters
			</button>
		</div>
	{/if}
</div>

<style lang="scss">
	.filterable-demo {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.search-container {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.search-wrapper {
		position: relative;
		width: 100%;
	}

	.search-icon {
		position: absolute;
		left: var(--spacing-md);
		top: 50%;
		transform: translateY(-50%);
		color: var(--primary-blue);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: var(--spacing-md) var(--spacing-md) var(--spacing-md) 48px;
		background: rgba(15, 23, 42, 0.6);
		border: 2px solid var(--primary-blue);
		border-radius: var(--radius-sm);
		color: var(--text-primary);
		font-size: var(--font-size-base);
		transition: all 0.3s ease;

		&::placeholder {
			color: var(--text-tertiary);
		}

		&:focus {
			outline: none;
			border-color: var(--primary-blue-bright);
			background: rgba(15, 23, 42, 0.8);
			box-shadow: 0 0 20px rgba(96, 165, 250, 0.3);
		}

		@media (max-width: 768px) {
			font-size: var(--font-size-sm);
			padding: var(--spacing-sm) var(--spacing-sm) var(--spacing-sm) 44px;
		}
	}

	.search-hint {
		color: var(--text-tertiary);
		font-size: var(--font-size-sm);
		text-align: center;
		margin: 0;

		@media (max-width: 768px) {
			font-size: var(--font-size-xs);
		}
	}

	.tags-container {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-sm);
		justify-content: center;
	}

	.filter-tag {
		padding: var(--spacing-sm) var(--spacing-md);
		background: rgba(96, 165, 250, 0.1);
		border: 1px solid var(--primary-blue);
		border-radius: 999px;
		color: var(--primary-blue-bright);
		font-size: var(--font-size-sm);
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;

		&:hover {
			background: rgba(96, 165, 250, 0.2);
			transform: translateY(-2px);
			box-shadow: 0 4px 12px rgba(96, 165, 250, 0.3);
		}

		&.active {
			background: var(--primary-blue-bright);
			color: var(--bg-primary);
			border-color: var(--primary-blue-bright);
			box-shadow: 0 4px 12px rgba(96, 165, 250, 0.4);
		}

		@media (max-width: 768px) {
			font-size: var(--font-size-xs);
			padding: 6px 12px;
		}
	}

	.results-info {
		text-align: center;
		padding: var(--spacing-sm) 0;
	}

	.results-count {
		color: var(--primary-blue-bright);
		font-size: var(--font-size-sm);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 1px;

		@media (max-width: 768px) {
			font-size: var(--font-size-xs);
		}
	}

	.projects-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--spacing-md);
		min-height: 300px;

		@media (max-width: 768px) {
			grid-template-columns: 1fr;
			gap: var(--spacing-sm);
			min-height: auto;
		}
	}

	.project-card {
		background: rgba(15, 23, 42, 0.6);
		border: 2px solid var(--primary-blue);
		border-radius: var(--radius-sm);
		overflow: hidden;
		transition: all 0.3s ease;

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 8px 24px rgba(96, 165, 250, 0.3);
			border-color: var(--primary-blue-bright);
		}
	}

	.project-image {
		width: 100%;
		aspect-ratio: 4 / 3;
		overflow: hidden;
		position: relative;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
			display: block;
		}
	}

	.project-info {
		padding: var(--spacing-md);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);

		@media (max-width: 768px) {
			padding: var(--spacing-sm);
		}
	}

	.project-title {
		color: var(--text-primary);
		font-size: var(--font-size-base);
		font-weight: 600;
		margin: 0;

		@media (max-width: 768px) {
			font-size: var(--font-size-sm);
		}
	}

	.project-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.tag {
		padding: 4px 8px;
		background: rgba(96, 165, 250, 0.15);
		border: 1px solid rgba(96, 165, 250, 0.3);
		border-radius: 4px;
		color: var(--primary-blue);
		font-size: 10px;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.5px;

		@media (max-width: 768px) {
			font-size: 9px;
			padding: 3px 6px;
		}
	}

	.no-results {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--spacing-md);
		padding: var(--spacing-xl);
		text-align: center;
		min-height: 300px;

		svg {
			color: var(--text-tertiary);
			opacity: 0.5;
		}

		p {
			color: var(--text-secondary);
			font-size: var(--font-size-lg);
			margin: 0;
		}

		@media (max-width: 768px) {
			min-height: 200px;
			padding: var(--spacing-lg);

			p {
				font-size: var(--font-size-base);
			}
		}
	}

	.reset-btn {
		padding: var(--spacing-sm) var(--spacing-lg);
		background: var(--primary-blue);
		border: none;
		border-radius: var(--radius-sm);
		color: white;
		font-size: var(--font-size-sm);
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;

		&:hover {
			background: var(--primary-blue-bright);
			transform: translateY(-2px);
			box-shadow: 0 4px 12px rgba(96, 165, 250, 0.4);
		}
	}
</style>

