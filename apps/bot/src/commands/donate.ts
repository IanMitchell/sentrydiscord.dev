import {
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { AutocompleteInteraction, CommandInteraction } from "discord.js";
import { Counter } from "prom-client";
import { CommandArgs } from "../typedefs";
import getLogger, { getInteractionMeta } from "../lib/core/logging";

const log = getLogger("command:donate");

const donateCounter = new Counter({
	name: "debug_on_command_total",
	help: "Total number of debug on commands ran",
});

export const command = new SlashCommandBuilder()
	.setName("donate")
	.setDescription(
		"Maintaing and hosting this bot costs money. If you've found it helpful, please donate!"
	);

export default async ({ bot }: CommandArgs) => {
	bot.onApplicationCommand(
		[command],
		async (interaction: CommandInteraction) => {
			donateCounter.inc();
			log.info(
				`Donation command ran by ${interaction.user?.id ?? "unknown"} in ${
					interaction.guild?.id ?? "unknown"
				}`,
				getInteractionMeta(interaction)
			);
			// TODO: Think of the reply message
			void interaction.reply();
		}
	);
};
