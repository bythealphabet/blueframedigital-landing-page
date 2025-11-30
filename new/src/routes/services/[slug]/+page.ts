import { error } from '@sveltejs/kit';
import { getServiceBySlug } from '$lib/data/services';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const service = getServiceBySlug(params.slug);

	if (!service) {
		throw error(404, {
			message: 'Service not found'
		});
	}

	return {
		service,
		meta: {
			title: `${service.title} | Blue Frame Digital`,
			description: service.metaDescription
		}
	};
};

