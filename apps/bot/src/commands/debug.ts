import {
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Counter } from "prom-client";
import { CommandArgs } from "../typedefs";
import getLogger, { getInteractionMeta } from "../lib/logging";

const log = getLogger("DebugCommand");

const pingCounter = new Counter({
	name: "debug_command_total",
	help: "Total number of ping commands ran",
});

export const command = new SlashCommandBuilder()
	.setName("debug")
	.setDescription("If the bot is online, you'll get a pong");

export const subcommandOn = new SlashCommandSubcommandBuilder()
	.setName("on")
	.setDescription("Turns debug mode on");

export const subcommandOff = new SlashCommandSubcommandBuilder()
	.setName("off")
	.setDescription("Turns debug mode off");

export default async ({ bot }: CommandArgs) => {
	const setDebug = async (interaction: CommandInteraction, value: boolean) => {
		if (interaction?.guild?.id == null) {
			return;
		}

		await bot.database.guild.update({
			where: {
				id: BigInt(interaction.guild.id),
			},
			data: {
				debug: value,
			},
		});
	};

	bot.onApplicationCommand(
		[command, subcommandOn],
		async (interaction: CommandInteraction) => {
			void setDebug(interaction, true);
		}
	);

	bot.onApplicationCommand(
		[command, subcommandOff],
		async (interaction: CommandInteraction) => {
			void setDebug(interaction, false);
		}
	);
};
