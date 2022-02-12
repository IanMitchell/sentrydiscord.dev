import NodeCache from "node-cache";

export const cache = new NodeCache();
const CACHE_DURATION = 1000 * 60 * 5;

export async function getCacheValue<T>(
	key: string,
	callback: () => Promise<T>
): Promise<T> {
	let value = cache.get<T>(key);

	if (value == null) {
		value = await callback();
		cache.set(key, value, CACHE_DURATION);
	}

	return value;
}
