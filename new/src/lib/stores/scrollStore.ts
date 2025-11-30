import { writable } from 'svelte/store';

// Store to track Services section visibility (0 = not visible, 1 = fully visible)
export const servicesVisibility = writable(0);

// Store to track if a service card is selected (to hide back-to-top button)
export const hasSelectedCard = writable(false);

