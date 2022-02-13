import path from "node:path";
import fs from "node:fs";
import {
	AutocompleteInteraction,
	Client,
	CommandInteraction,
	Interaction,
	MessageButton,
	MessageComponentInteraction,
	MessageSelectMenu,
} from "discord.js";
import { getDirname } from "./lib/node/files";
import {
	ActionHandler,
	BotCommand,
	BotComponent,
	CommandBuilderDefinition,
	CommandModule,
} from "./typedefs";
import database from "./lib/core/database";
import getLogger, { getInteractionMeta } from "./lib/logging";
import Sentry from "./lib/logging/sentry";
import { SlashCommandBuilder } from "@discordjs/builders";
import {
	getMergedApplicationCommandData,
	getSerializedCommandInteractionKey,
	getSlashCommandKey,
} from "./lib/core/commands";
import chalk from "chalk";
import type { PrismaClient } from "@prisma/client";
import { getException } from "./lib/node/error";
import { Counter } from "prom-client";

const log = getLogger("bot");

const interactionCounter = new Counter({
	name: "interaction_total",
	help: "Total Interactions handled",
});

export class Application extends Client {
	public readonly database: PrismaClient;
	public readonly applicationCommands: Map<
		string,
		BotCommand<CommandInteraction>
	>;

	public readonly autocompleteHandlers: Map<
		string,
		BotCommand<AutocompleteInteraction>
	>;

	public readonly messageComponents: Map<string, BotComponent>;

	constructor() {
		log.info("Booting up...");
		super({
			intents: [],
			allowedMentions: { parse: ["users"] },
		});

		this.database = database;
		this.applicationCommands = new Map();
		this.autocompleteHandlers = new Map();
		this.messageComponents = new Map();

		log.info("Loading Application Commands");
		void this.loadDirectory("commands");

		log.info("Loading Application Listeners");
		void this.loadDirectory("listeners");

		this.on("ready", this.initialize);
		this.on("interactionCreate", this.handleInteraction);
		this.on("interactionCreate", () => {
			interactionCounter.inc();
		});
		this.on("error", (error) => {
			log.fatal(error.message);
			Sentry.captureException(error);
		});
	}

	async initialize() {
		log.info("Initializing...");
		void this.registerApplicationCommands();
	}

	async loadDirectory(relativePath: string) {
		log.info(`Loading ${relativePath}`);
		const directory = path.join(getDirname(import.meta.url), relativePath);

		fs.readdir(directory, (err, files) => {
			if (err) {
				throw err;
			}

			files.forEach(async (file) => this.loadFile(directory, file));
		});
	}

	async loadFile(directory: string, file: string) {
		if (!file.endsWith(".js")) {
			return;
		}

		log.info(`Loading ${chalk.blue(file)}`);

		try {
			const data = (await import(path.join(directory, file))) as CommandModule;

			return data.default({
				bot: this,
			});
		} catch (err: unknown) {
			const error = getException(err);
			log.fatal(error.message, { file });
			Sentry.captureException(error);
			process.exit(1);
		}
	}

	getSerializedApplicationData() {
		const commands = new Map<string, SlashCommandBuilder>();

		Array.from(this.applicationCommands.values()).forEach((entry) => {
			const [{ name }] = entry.commands;
			if (commands.has(name)) {
				const command = commands.get(name);
				commands.set(
					name,
					getMergedApplicationCommandData(entry.commands, command)
				);
			} else {
				commands.set(name, getMergedApplicationCommandData(entry.commands));
			}
		});

		return Array.from(commands.values()).map((builder) => builder.toJSON());
	}

	async registerApplicationCommands() {
		const serializedCommands = this.getSerializedApplicationData();

		try {
			if (process.env.NODE_ENV === "production") {
				log.info("Registering Global Application Commands");
				await this.application?.commands.set(serializedCommands);
			} else {
				log.info("Registering Development Guild Application Commands");
				const target = await this.guilds.fetch(
					process.env.DEVELOPMENT_GUILD_ID!
				);
				await target.commands.set(serializedCommands);
			}
		} catch (err: unknown) {
			const error = getException(err);
			log.error(error.message);
			Sentry.captureException(error);
		}
	}

	handleInteraction(interaction: Interaction) {
		if (interaction.isCommand()) {
			const key = getSerializedCommandInteractionKey(interaction);

			if (this.applicationCommands.has(key)) {
				try {
					this.applicationCommands.get(key)?.handler(interaction);
				} catch (err: unknown) {
					const error = getException(err);
					log.error(error.message, getInteractionMeta(interaction));
					Sentry.captureException(error);
				}
			} else {
				log.error(
					`Unknown command interaction: ${key}`,
					getInteractionMeta(interaction)
				);
			}
		} else if (interaction.isMessageComponent()) {
			if (!this.messageComponents.has(interaction.customId)) {
				log.error(
					`Unknown component interaction: ${interaction.customId}`,
					getInteractionMeta(interaction)
				);
				return;
			}

			try {
				this.messageComponents.get(interaction.customId)?.handler(interaction);
			} catch (err: unknown) {
				const error = getException(err);
				log.error(error.message, getInteractionMeta(interaction));
				Sentry.captureException(error);
			}
		} else if (interaction.isAutocomplete()) {
			const key = getSerializedCommandInteractionKey(interaction);

			if (this.autocompleteHandlers.has(key)) {
				try {
					this.autocompleteHandlers.get(key)?.handler(interaction);
				} catch (err: unknown) {
					const error = getException(err);
					log.error(error.message, getInteractionMeta(interaction));
					Sentry.captureException(error);
				}
			} else {
				log.error(
					`Unknown autocomplete interaction: ${key}`,
					getInteractionMeta(interaction)
				);
			}
		}
	}

	onApplicationCommand(
		command: CommandBuilderDefinition,
		handler: ActionHandler<CommandInteraction>
	) {
		this.applicationCommands.set(getSlashCommandKey(command), {
			commands: Array.isArray(command) ? command : [command],
			handler,
		});
	}

	onAutocomplete(
		command: CommandBuilderDefinition,
		handler: ActionHandler<AutocompleteInteraction>
	) {
		this.autocompleteHandlers.set(getSlashCommandKey(command), {
			commands: Array.isArray(command) ? command : [command],
			handler,
		});
	}

	onMessageComponent(
		component: MessageButton | MessageSelectMenu,
		handler: ActionHandler<MessageComponentInteraction>
	) {
		if (component.customId != null) {
			this.messageComponents.set(component.customId, {
				component,
				handler,
			});
		}
	}
}

const bot = (() => {
	try {
		const client = new Application();
		client.login(process.env.TOKEN).catch((err: unknown) => {
			const error = getException(err);
			log.fatal(error.message);
			process.exit(1);
		});

		return client;
	} catch (err: unknown) {
		const error = getException(err);
		log.fatal(error.message);
		process.exit(1);
	}
})();
export default bot;
