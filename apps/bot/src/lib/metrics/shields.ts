export function createShield(message: string, label: string, color = "green") {
	return {
		schemaVersion: 1,
		message,
		label,
		color,
		style: "for-the-badge",
	};
}
