import type { LayoutLoad } from './$types';
import { error } from '@sveltejs/kit';
import { isValidServiceSlug } from '$lib/data/services';

export const load: LayoutLoad = ({ params }) => {
	const { slug } = params;

	// Validate slug if present
	if (slug && !isValidServiceSlug(slug)) {
		throw error(404, 'Service not found');
	}

	return {
		slug: slug || null
	};
};

