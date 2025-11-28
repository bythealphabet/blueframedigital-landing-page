import { writable, derived } from 'svelte/store';

export type AnimationPhase =
	| 'idle' // No animation
	| 'selecting' // Card clicked, navigation starting
	| 'positioning' // FLIP calculation done
	| 'exiting' // Non-selected cards leaving
	| 'repositioning' // Selected card moving
	| 'revealing' // Detail content entering
	| 'complete' // Animation done
	| 'deselecting'; // Returning to grid

export interface CardAnimationState {
	slug: string;
	phase: 'idle' | 'moving' | 'exiting' | 'hidden' | 'entering';
	progress: number; // 0-1
	exitDelay: number; // ms
}

function createAnimationCoordinator() {
	const phase = writable<AnimationPhase>('idle');
	const cardStates = writable<Map<string, CardAnimationState>>(new Map());
	const selectedSlug = writable<string | null>(null);

	return {
		phase,
		cardStates,
		selectedSlug,

		// Start selection animation
		selectCard: (slug: string, allSlugs: string[]) => {
			selectedSlug.set(slug);
			phase.set('selecting');

			// Calculate card states
			const selectedIndex = allSlugs.indexOf(slug);
			const states = new Map<CardAnimationState>();

			allSlugs.forEach((cardSlug, index) => {
				if (cardSlug === slug) {
					states.set(cardSlug, {
						slug: cardSlug,
						phase: 'moving',
						progress: 0,
						exitDelay: 0
					});
				} else {
					// Calculate exit delay based on distance
					const distance = Math.abs(index - selectedIndex);
					states.set(cardSlug, {
						slug: cardSlug,
						phase: 'exiting',
						progress: 0,
						exitDelay: distance * 50 // 50ms per step
					});
				}
			});

			cardStates.set(states);

			// Progress through animation phases - synced with 3D elevation (800ms)
			setTimeout(() => phase.set('positioning'), 0);
			setTimeout(() => phase.set('exiting'), 150);
			setTimeout(() => phase.set('repositioning'), 250);
			setTimeout(() => phase.set('revealing'), 900);
			setTimeout(() => phase.set('complete'), 1000);
		},

		// Start deselection animation (return to grid)
		deselectCard: (slug: string, allSlugs: string[]) => {
			phase.set('deselecting');

			const states = new Map<CardAnimationState>();
			const selectedIndex = allSlugs.indexOf(slug);

			// Reverse animation - all cards enter with staggered timing
			allSlugs.forEach((cardSlug, index) => {
				if (cardSlug === slug) {
					states.set(cardSlug, {
						slug: cardSlug,
						phase: 'moving',
						progress: 0,
						exitDelay: 0
					});
				} else {
					const distance = Math.abs(index - selectedIndex);
					states.set(cardSlug, {
						slug: cardSlug,
						phase: 'entering',
						progress: 0,
						exitDelay: distance * 50
					});
				}
			});

			cardStates.set(states);

			// Return to idle after animation completes
			setTimeout(() => {
				selectedSlug.set(null);
				phase.set('idle');
				cardStates.set(new Map());
			}, 800);
		},

		// Reset to idle state
		reset: () => {
			phase.set('idle');
			selectedSlug.set(null);
			cardStates.set(new Map());
		}
	};
}

export const animationCoordinator = createAnimationCoordinator();

