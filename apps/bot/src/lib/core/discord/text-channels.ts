import { NonThreadGuildBasedChannel, Permissions } from "discord.js";
import bot from "../../../bot";

export function canSendMessage(channel: NonThreadGuildBasedChannel | null) {
	if (channel == null || bot.user == null || !channel.isText()) {
		return false;
	}

	const permissions = channel.permissionsFor(bot.user);

	return permissions?.has(
		Permissions.FLAGS.SEND_MESSAGES & Permissions.FLAGS.EMBED_LINKS
	);
}
