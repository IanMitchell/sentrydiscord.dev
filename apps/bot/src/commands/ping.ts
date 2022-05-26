import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Counter } from "prom-client";
import { CommandArgs } from "../typedefs";
import getLogger, { getInteractionMeta } from "../lib/core/logging";

const log = getLogger("command:ping");

const pingCounter = new Counter({
	name: "ping_command_total",
	help: "Total number of ping commands ran",
});

export const command = new SlashCommandBuilder()
	.setName("ping")
	.setDescription("If the bot is online, you'll get a pong back");

export default async ({ bot }: CommandArgs) => {
	bot.onApplicationCommand(command, (interaction: CommandInteraction) => {
		log.info(
			`Ping request (${bot.ws.ping}ms)`,
			getInteractionMeta(interaction)
		);
		pingCounter.inc();

		void interaction.reply({
			content: `🏓 Pong! ${bot.ws.ping}ms`,
		});
	});
};
