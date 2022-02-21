import { canSendMessage } from "../lib/core/discord/text-channels";
import { getIssueAlertEmbed } from "../lib/parser/issue-alert";
import bot from "../bot";

export default async function handleEvent(json: Record<string, any>) {
	// TODO: look up corresponding guild and target channel for project event
	const guildId = "";
	const channelId = "";

	const embed = await getIssueAlertEmbed(json);
	const guild = await bot.guilds?.fetch(guildId);
	const channel = await guild?.channels?.fetch(channelId);

	if (channel?.isText() && canSendMessage(channel)) {
		void channel.send({ embeds: [embed] });
	}
}
