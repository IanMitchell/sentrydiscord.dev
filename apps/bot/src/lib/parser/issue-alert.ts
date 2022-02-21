import { MessageEmbed } from "discord.js";

export async function getIssueAlertEmbed(json: Record<string, any>) {
	const embed = new MessageEmbed();
	embed.setColor(0xff0000);

	const url = getIssueAlertUrl(json);
	if (url != null) {
		embed.setURL(url);
	}

	// Add contexts

	// Add tags

	// Add triggered rule

	// Add stacktrace

	// add exception name and title

	// add sentry author

	// add link to bot

	return embed;
}

export function getIssueAlertUrl(json: Record<string, any>) {
	return json?.data?.event?.url as string | undefined;
}
