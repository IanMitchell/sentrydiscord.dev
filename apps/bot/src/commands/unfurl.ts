import {
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Counter } from "prom-client";
import { CommandArgs } from "../typedefs";
import getLogger, { getInteractionMeta } from "../lib/core/logging";

const log = getLogger("command:debug");

const unfurlOnCounter = new Counter({
	name: "unfurl_on_command_total",
	help: "Total number of unfurl on commands ran",
});

const unfurlOffCounter = new Counter({
	name: "unfurl_off_command_total",
	help: "Total number of unfurl off commands ran",
});

export const command = new SlashCommandBuilder()
	.setName("unfurl")
	.setDescription(
		"Recognizes Sentry event links posted in chat and replies with a short synopsis."
	);

export const subcommandOn = new SlashCommandSubcommandBuilder()
	.setName("on")
	.setDescription("Turns the unfurler on for your server");

export const subcommandOff = new SlashCommandSubcommandBuilder()
	.setName("off")
	.setDescription("Turns the unfurler off for your server");

export default async ({ bot }: CommandArgs) => {
	const setUnfurler = async (
		interaction: CommandInteraction,
		value: boolean
	) => {
		if (interaction?.guild?.id == null) {
			return;
		}

		await bot.database.guild.update({
			where: {
				id: BigInt(interaction.guild.id),
			},
			data: {
				unfurl: value,
			},
		});
	};

	bot.onApplicationCommand(
		[command, subcommandOn],
		async (interaction: CommandInteraction) => {
			void interaction.deferReply();

			unfurlOnCounter.inc();
			log.info(
				`Turning unfurler on for ${interaction.guild?.id ?? "unknown"}`,
				getInteractionMeta(interaction)
			);

			await setUnfurler(interaction, true);
			void interaction.reply({
				content: "Unfurler turned on; I will do X Y Z.",
			});
		}
	);

	bot.onApplicationCommand(
		[command, subcommandOff],
		async (interaction: CommandInteraction) => {
			void interaction.deferReply();

			unfurlOffCounter.inc();
			log.info(
				`Turning unfurler off for ${interaction.guild?.id ?? "unknown"}`,
				getInteractionMeta(interaction)
			);

			await setUnfurler(interaction, false);
			void interaction.reply({
				content: "Unfurler turned off. To turn on, do X Y Z",
			});
		}
	);
};
