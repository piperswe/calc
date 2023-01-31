import { browser } from '$app/environment';

export function readFromLocalStorage<T, Serialized>(
	key: string,
	deserializer: (xx: Serialized) => T
): T | null {
	if (!browser) {
		return null;
	}
	const item = localStorage.getItem(key);
	if (item == null) {
		return null;
	}
	try {
		return deserializer(JSON.parse(item));
	} catch (e) {
		console.error('Error loading from localStorage: ', e);
		return null;
	}
}

export function writeToLocalStorage<T, Serialized>(
	key: string,
	x: T,
	serializer: (x: T) => Serialized
) {
	if (!browser) {
		return null;
	}
	localStorage.setItem(key, JSON.stringify(serializer(x)));
}
