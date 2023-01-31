import { XMLSerializer, DOMImplementation } from 'xmldom';

import { allLinks } from '$lib/sitemap';

const domImplementation = new DOMImplementation();
const serializer = new XMLSerializer();

function addLink(path: string, doc: ReturnType<(typeof domImplementation)['createDocument']>) {
	const url = doc.createElement('url');
	const loc = doc.createElement('loc');
	const locText = doc.createTextNode('https://calc.piperswe.me' + path);
	loc.appendChild(locText);
	url.appendChild(loc);
	doc.documentElement.appendChild(url);
}

function generateSitemap(): string {
	const doc = domImplementation.createDocument(
		'https://www.sitemaps.org/schemas/sitemap/0.9',
		'urlset'
	);
	addLink('/', doc);
	for (const link of allLinks()) {
		addLink(link.path, doc);
	}
	const serialized = serializer.serializeToString(doc);
	return (
		`<?xml version="1.0" encoding="UTF-8"?>
` + serialized
	);
}

const sitemapXML = generateSitemap();

export async function GET() {
	return new Response(sitemapXML, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
}

export const prerender = true;
