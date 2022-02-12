export function isInstall(json: Record<string, unknown>) {
	return json.action === "created";
}

export function isUninstall(json: Record<string, unknown>) {
	return json.action === "deleted";
}
