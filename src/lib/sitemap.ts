export interface Link {
	name: string;
	path: string;
}

export interface Category {
	name: string;
	subcategories: Category[];
	links: Link[];
}

export const sitemap: Category[] = [
	{
		name: 'Taxes',
		subcategories: [],
		links: [
			{
				name: 'W-4 Calculator',
				path: '/calculators/taxes/w4'
			}
		]
	}
];

export function categoryLinks(category: Category): Link[] {
	const links = [];
	for (const subcategory of category.subcategories) {
		links.push(...categoryLinks(subcategory));
	}
	links.push(...category.links);
	return links.map((link) => ({
		...link,
		name: `${category.name} / ${link.name}`
	}));
}

export function allLinks(): Link[] {
	const links = [];
	for (const category of sitemap) {
		links.push(...categoryLinks(category));
	}
	return links;
}
