import {
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { AutocompleteInteraction, CommandInteraction } from "discord.js";
import { Counter } from "prom-client";
import { CommandArgs } from "../typedefs";
import getLogger, { getInteractionMeta } from "../lib/core/logging";

const log = getLogger("command:debug");

const debugOnCounter = new Counter({
	name: "debug_on_command_total",
	help: "Total number of debug on commands ran",
});

const debugOffCounter = new Counter({
	name: "debug_off_command_total",
	help: "Total number of debug off commands ran",
});

export const command = new SlashCommandBuilder()
	.setName("debug")
	.setDescription(
		"Saves received events for review and submission. Useful for helping improve error reports."
	);

export const subcommandOn = new SlashCommandSubcommandBuilder()
	.setName("on")
	.setDescription("Turns debug mode on")
	.addStringOption((option) =>
		option
			.setName("project")
			.setRequired(false)
			.setDescription("Turn Debug on for a specific project")
			.setAutocomplete(true)
	);

export const subcommandOff = new SlashCommandSubcommandBuilder()
	.setName("off")
	.setDescription("Turns debug mode off")
	.addStringOption((option) =>
		option
			.setName("project")
			.setRequired(false)
			.setDescription("Turn Debug off for a specific project")
			.setAutocomplete(true)
	);

export default async ({ bot }: CommandArgs) => {
	const setDebug = async (interaction: CommandInteraction, value: boolean) => {
		if (interaction?.guild?.id == null) {
			return;
		}

		const installId = interaction.options.getString("project", false);

		if (installId) {
			await bot.database.install.update({
				where: {
					id: installId,
				},
				data: {
					debug: value,
				},
			});
		} else {
			await bot.database.install.updateMany({
				where: {
					connections: {
						every: {
							guildId: BigInt(interaction.guild.id),
						},
					},
				},
				data: {
					debug: value,
				},
			});
		}
	};

	const getProjectOptions = async (guildId: string) => {
		const installIds = await bot.database.guild.findUnique({
			where: {
				id: BigInt(guildId),
			},
			include: {
				connections: {
					include: {
						install: true,
					},
				},
			},
		});

		// get details from sentry

		// TODO: get project names for all installations
		// TODO: cache this value for 1m? 5m?
		// TODO: iterate over all names and call .contains or some fuzzy search bs on the value
		// TODO: return the results
		return [];
	};

	bot.onApplicationCommand(
		[command, subcommandOn],
		async (interaction: CommandInteraction) => {
			debugOnCounter.inc();
			log.info(
				`Turning debug on for ${interaction.guild?.id ?? "unknown"}`,
				getInteractionMeta(interaction)
			);
			void setDebug(interaction, true);
		}
	);

	bot.onApplicationCommand(
		[command, subcommandOff],
		async (interaction: CommandInteraction) => {
			debugOffCounter.inc();
			log.info(
				`Turning debug off for ${interaction.guild?.id ?? "unknown"}`,
				getInteractionMeta(interaction)
			);
			void setDebug(interaction, false);
		}
	);

	bot.onAutocomplete(
		[command, subcommandOn],
		async (interaction: AutocompleteInteraction) => {
			const projectOptions = await getProjectOptions(
				interaction?.guild?.id ?? ""
			);
			void interaction.respond(projectOptions);
		}
	);

	bot.onAutocomplete(
		[command, subcommandOff],
		async (interaction: AutocompleteInteraction) => {
			const projectOptions = await getProjectOptions(
				interaction?.guild?.id ?? ""
			);
			void interaction.respond(projectOptions);
		}
	);
};
