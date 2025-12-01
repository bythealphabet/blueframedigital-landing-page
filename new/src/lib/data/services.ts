export interface ProjectCategory {
	title: string;
	description: string;
	type: 'images' | 'before-after' | 'video';
	images?: string[];
	beforeImage?: string;
	afterImage?: string;
	videoUrl?: string;
	videoPoster?: string;
	stats?: { label: string; value: string }[];
}

export interface JourneyStep {
	icon: string;
	title: string;
	description: string;
	timeframe: string;
}

export interface ServiceDetailContent {
	type: 'carousel' | 'gallery' | 'text-icon' | 'phone-mockup' | 'search-visual' | 'support-info';
	images?: string[];
	text?: string;
	features?: string[];
	stats?: { label: string; value: string; icon?: string }[];
	journeySteps?: JourneyStep[];
	// For gallery type with new ProjectCategory format
	categories?: ProjectCategory[];
}

export interface Service {
	slug: string;
	icon: string;
	title: string;
	description: string;
	detailContent: ServiceDetailContent;
	metaDescription: string;
}

export const services: Service[] = [
	{
		slug: 'professional-websites',
		icon: 'globe',
		title: 'Professional Websites',
		description:
			'Showcase your construction projects with a modern, professional website that builds trust with potential clients.',
		detailContent: {
			type: 'carousel',
			images: [
				'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1200&q=80',
				'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
				'https://images.unsplash.com/photo-1503602642458-232111445657?w=1200&q=80',
				'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80'
			],
			text: 'We build custom websites using modern technologies like SvelteKit, ensuring fast load times, beautiful designs, and a professional online presence that sets you apart from competitors. Every website is tailored to showcase your unique construction expertise and project portfolio.'
		},
		metaDescription:
			'Professional website development for construction businesses in Curaçao. Modern, fast, and designed to showcase your projects.'
	},
	{
		slug: 'project-galleries',
		icon: 'image',
		title: 'Project Galleries',
		description:
			'Display your completed projects with beautiful photo galleries that highlight your craftsmanship and expertise.',
		detailContent: {
			type: 'gallery',
			categories: [
				{
					title: 'Grid Portfolio Galleries',
					description:
						'Showcase your finest work in stunning grid layouts. Auto-optimized images load instantly, letting your craftsmanship speak for itself.',
					type: 'images',
					images: [
						'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
						'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
						'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80'
					],
					stats: [
						{ label: 'Load Time', value: '< 2s' },
						{ label: 'Image Optimization', value: 'Automatic' }
					]
				},
				{
					title: 'Before/After Sliders',
					description:
						'Reveal transformations with a simple drag. Let clients experience the dramatic impact of your work firsthand.',
					type: 'before-after',
					beforeImage: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80',
					afterImage: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80',
					stats: [
						{ label: 'Engagement Boost', value: '3x Higher' },
						{ label: 'Mobile Friendly', value: '100%' }
					]
				},
				{
					title: 'Video Showcase Galleries',
					description:
						'Bring your projects to life. Time-lapses, walkthroughs, and testimonials that immerse visitors in your process and results.',
					type: 'video',
					videoUrl:
						'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
					videoPoster: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=1200&q=80',
					stats: [
						{ label: 'Video Support', value: 'All Formats' },
						{ label: 'Auto-Optimize', value: 'Yes' }
					]
				},
				{
					title: 'Filterable Project Galleries',
					description:
						'Smart filtering for diverse portfolios. Help clients find exactly what they\'re looking for—instantly.',
					type: 'filterable-demo',
					stats: [
						{ label: 'Filter Options', value: 'Unlimited' },
						{ label: 'Search Speed', value: 'Instant' }
					]
				}
			]
		},
		metaDescription:
			'We build beautiful, optimized project galleries for construction businesses. From grid layouts to before/after sliders and video galleries.'
	},
	{
		slug: 'lead-generation',
		icon: 'phone',
		title: 'Lead Generation',
		description:
			'Convert website visitors into clients with contact forms, quote requests, and clear calls-to-action.',
		detailContent: {
			type: 'text-icon',
			text: 'See exactly how we turn website visitors into paying clients—24/7. Watch the entire journey from first click to closed project.',
			journeySteps: [
				{
					icon: 'user',
					title: 'Visitor Arrives',
					description: 'Someone finds your site looking for construction services',
					timeframe: 'Anytime, 24/7'
				},
				{
					icon: 'file-text',
					title: 'Fills Form',
					description: 'Name, project type, budget, timeline—everything you need',
					timeframe: '< 30 seconds'
				},
				{
					icon: 'send',
					title: 'Instant Notification',
					description: 'Email + SMS alert sent directly to your phone',
					timeframe: '< 5 seconds'
				},
				{
					icon: 'message-circle',
					title: 'You Respond',
					description: 'Reply with a quote or ask follow-up questions',
					timeframe: '< 1 hour'
				},
				{
					icon: 'handshake',
					title: 'New Client',
					description: 'Convert qualified lead into a paying project',
					timeframe: '30% close rate'
				}
			],
			stats: [
				{
					icon: 'trending-up',
					label: 'Avg. Conversion',
					value: '3-5%'
				},
				{
					icon: 'zap',
					label: 'Response Time',
					value: '< 1 hour'
				},
				{
					icon: 'target',
					label: 'Lead Quality',
					value: 'High Intent'
				}
			],
			features: [
				'Custom contact forms with instant notifications',
				'Quote request systems with project details',
				'Strategic placement of CTAs throughout the site',
				'Integration with your email and CRM systems',
				'Testimonials and social proof displays',
				'Trust badges and certifications'
			]
		},
		metaDescription:
			'Convert website visitors into construction clients with strategic lead generation forms and calls-to-action.'
	},
	{
		slug: 'mobile-friendly-design',
		icon: 'smartphone',
		title: 'Mobile-Friendly Design',
		description: 'Your clients browse on their phones. Your website will look perfect on all devices.',
		detailContent: {
			type: 'phone-mockup',
			images: ['/images/services/mobile-friendly-design/phone-demo.svg'],
			text: 'Over 60% of web traffic comes from mobile devices. We build responsive websites that adapt seamlessly to any screen size. Fast loading, easy navigation, and thumb-friendly buttons ensure potential clients can browse your services and contact you from anywhere.',
			stats: [
				{ label: 'Mobile Traffic', value: '60%+' },
				{ label: 'Page Load Time', value: '< 2s' },
				{ label: 'Responsive Design', value: '100%' }
			]
		},
		metaDescription:
			'Mobile-responsive website design ensuring your construction business looks perfect on all devices and screen sizes.'
	},
	{
		slug: 'local-seo',
		icon: 'search',
		title: 'Local SEO',
		description: 'Get found by local customers searching for construction services in Curaçao.',
		detailContent: {
			type: 'search-visual',
			images: ['/images/services/local-seo/google-search.svg'],
			text: 'Imagine a homeowner in Curaçao searches "construction company near me" or "home renovation Willemstad." With proper local SEO, your business appears at the top of the results. We optimize your website for local search terms, set up your Google Business Profile, and ensure you\'re visible when local customers are ready to hire.',
			features: [
				'Google Business Profile optimization',
				'Local keyword targeting (Curaçao, Willemstad, etc.)',
				'Schema markup for construction businesses',
				'Local directory submissions',
				'Review management and display',
				'Location-specific content optimization'
			]
		},
		metaDescription:
			'Local SEO services to help your construction business rank higher in Curaçao search results and attract local clients.'
	},
	{
		slug: 'ongoing-support',
		icon: 'headphones',
		title: 'Ongoing Support',
		description: 'We maintain and update your website so you can focus on building.',
		detailContent: {
			type: 'support-info',
			images: ['/images/services/ongoing-support/support-team.svg'],
			text: 'Your website needs regular updates, security patches, and content changes. We provide ongoing maintenance so you can focus on what you do best—building. From adding new projects to updating contact information, we\'ve got you covered.',
			features: [
				'Regular security updates and backups',
				'Content updates (new projects, team members, etc.)',
				'Performance monitoring and optimization',
				'Technical support via email and phone',
				'Domain and hosting management',
				'Monthly analytics reports',
				'Bug fixes and troubleshooting',
				'Feature enhancements as needed'
			]
		},
		metaDescription:
			'Reliable ongoing website support and maintenance for construction businesses. Focus on building while we maintain your site.'
	}
];

// Helper function to get service by slug
export function getServiceBySlug(slug: string): Service | undefined {
	return services.find((service) => service.slug === slug);
}

// Helper function to get all service slugs (useful for static generation)
export function getAllServiceSlugs(): string[] {
	return services.map((service) => service.slug);
}

// Helper function to validate slug
export function isValidServiceSlug(slug: string): boolean {
	return services.some((service) => service.slug === slug);
}

