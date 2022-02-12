import {
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
	SlashCommandSubcommandGroupBuilder,
} from "@discordjs/builders";
import {
	CommandInteraction,
	MessageComponent,
	MessageComponentInteraction,
} from "discord.js";
import Application from "./bot";

type Bot = typeof Application;

export type CommandBuilderDefinition =
	| SlashCommandBuilder
	| [SlashCommandBuilder]
	| [SlashCommandBuilder, SlashCommandSubcommandBuilder]
	| [
			SlashCommandBuilder,
			SlashCommandSubcommandGroupBuilder,
			SlashCommandSubcommandBuilder
	  ];

export type CommandBuilderSequence = Exclude<
	CommandBuilderDefinition,
	SlashCommandBuilder
>;

export type CommandModule = {
	default: ({ bot }: { bot: Bot }) => unknown;
};

export type CommandArgs = {
	bot: Bot;
};

export type ActionHandler<T> = (interaction: T) => unknown;

export interface BotCommand {
	commands: CommandBuilderSequence;
	handler: ActionHandler<CommandInteraction>;
}

// export interface BotListener {}

export interface BotComponent {
	component: MessageComponent;
	handler: ActionHandler<MessageComponentInteraction>;
}
