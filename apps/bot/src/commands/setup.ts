import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { CommandArgs } from "../typedefs";

export const command = new SlashCommandBuilder()
	.setName("setup")
	.setDescription("Coming soon!");

export default async ({ bot }: CommandArgs) => {
	bot.onApplicationCommand(command, (interaction: CommandInteraction) => {
		void interaction.reply({
			content: `This feature is a work in progress. It will help connect Sentry with your Discord server if you add the bot before linking to Sentry via oauth.)`,
		});
	});
};
