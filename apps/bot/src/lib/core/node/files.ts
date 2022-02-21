import { dirname } from "path";
import { fileURLToPath, URL } from "url";

/**
 * Call with `import.meta.url` to get the `__filename` equivalent
 */
export function getFilename(url: URL | string) {
	return fileURLToPath(url);
}

/**
 * Call with `import.meta.url` to get the `__dirname` equivalent
 */
export function getDirname(url: URL | string) {
	return dirname(getFilename(url));
}
