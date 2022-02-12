export function getInstallationId(json: Record<string, any>) {
	const uuid = json.installation?.uuid as string | undefined;

	if (uuid == null) {
		throw new Error("No Set Installation UUID");
	}

	return uuid;
}
