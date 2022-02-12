import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Counter } from "prom-client";
import { CommandArgs } from "../typedefs";
import getLogger, { getInteractionMeta } from "../lib/logging";

const log = getLogger("command:ping");

const pingCounter = new Counter({
	name: "ping_command_total",
	help: "Total number of ping commands ran",
});

export const command = new SlashCommandBuilder()
	.setName("ping")
	.setDescription("If the bot is online, you'll get a pong");

export default async ({ bot }: CommandArgs) => {
	bot.onApplicationCommand(command, (interaction: CommandInteraction) => {
		log.info("Generating response", getInteractionMeta(interaction));
		pingCounter.inc();
		void interaction.reply({
			content: `🏓pong! ${bot.ws.ping}ms`,
		});
	});
};
