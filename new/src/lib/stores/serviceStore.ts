import { writable } from 'svelte/store';

interface ServiceStoreState {
	selectedSlug: string | null;
	isAnimating: boolean;
	previousRoute: string | null;
}

function createServiceStore() {
	const { subscribe, set, update } = writable<ServiceStoreState>({
		selectedSlug: null,
		isAnimating: false,
		previousRoute: null
	});

	return {
		subscribe,
		selectService: (slug: string, previousRoute: string = '/') => {
			update((state) => ({
				...state,
				selectedSlug: slug,
				previousRoute
			}));
		},
		clearSelection: () => {
			update((state) => ({
				...state,
				selectedSlug: null
			}));
		},
		setAnimating: (isAnimating: boolean) => {
			update((state) => ({
				...state,
				isAnimating
			}));
		},
		reset: () => {
			set({
				selectedSlug: null,
				isAnimating: false,
				previousRoute: null
			});
		}
	};
}

export const serviceStore = createServiceStore();

