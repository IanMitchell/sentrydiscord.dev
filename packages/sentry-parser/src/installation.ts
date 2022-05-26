export function isInstall(json: Record<string, any>) {
	return json.action === "created";
}

export function isUninstall(json: Record<string, any>) {
	return json.action === "deleted";
}

export function getName(json: Record<string, any>) {
	const org = json?.data?.installation?.organization?.slug;
	const app = json?.data?.installation?.app?.slug;

	let name = "";

	if (org) {
		name += `${org}/`;
	}

	if (app) {
		name += app;
	}

	return name;
}
