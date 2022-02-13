import {
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
	SlashCommandSubcommandGroupBuilder,
} from "@discordjs/builders";
import {
	CommandInteraction,
	Interaction,
	MessageComponent,
	MessageComponentInteraction,
} from "discord.js";
import Application from "./bot";

type Bot = typeof Application;

export enum SentryWebhook {
	Installation,
	Uninstallation,
	IssueAlert,
	MetricAlert,
}

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

export interface BotCommand<T extends Interaction> {
	commands: CommandBuilderSequence;
	handler: ActionHandler<T>;
}

// export interface BotListener {}

export interface BotComponent {
	component: MessageComponent;
	handler: ActionHandler<MessageComponentInteraction>;
}
