import { MessageEmbed } from "discord.js";

export function getIssueAlertEmbed(json: Record<string, any>) {
	return new MessageEmbed();
}

export function getIssueAlertUrl(json: Record<string, any>) {
	return json?.data?.event?.url as string | undefined;
}
