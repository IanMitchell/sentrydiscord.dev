import {
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
	SlashCommandSubcommandGroupBuilder,
} from "@discordjs/builders";
import { AutocompleteInteraction, CommandInteraction } from "discord.js";
import {
	CommandBuilderDefinition,
	CommandBuilderSequence,
} from "../../typedefs";

export function getSlashCommandKey(definition: CommandBuilderDefinition) {
	if (Array.isArray(definition)) {
		return definition.map((component) => component.name).join("-");
	}

	return definition.name;
}

export function getSerializedCommandInteractionKey(
	interaction: CommandInteraction | AutocompleteInteraction
) {
	const name = interaction.commandName;
	const group = interaction.options.getSubcommandGroup(false);
	const subcommand = interaction.options.getSubcommand(false);

	return [name, group, subcommand].filter((value) => Boolean(value)).join("-");
}

export function getMergedApplicationCommandData(
	data: CommandBuilderSequence,
	base: SlashCommandBuilder | null = null
) {
	const command = base ?? data[0];

	const [subcommand, group] = data.slice(1, 3);

	if (
		group != null &&
		group instanceof SlashCommandSubcommandGroupBuilder &&
		subcommand instanceof SlashCommandSubcommandBuilder
	) {
		group.addSubcommand(subcommand);
		command.addSubcommandGroup(group);
	} else if (
		subcommand != null &&
		subcommand instanceof SlashCommandSubcommandBuilder
	) {
		command.addSubcommand(subcommand);
	}

	return command;
}
