export function getException(error: unknown): Error {
	if (error instanceof Error) {
		return error;
	}

	if (typeof error === "string" || error === undefined) {
		return new Error(error);
	}

	return new Error(JSON.stringify(error));
}
