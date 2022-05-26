import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { CommandArgs } from "../typedefs";

export const command = new SlashCommandBuilder()
	.setName("help")
	.setDescription("Coming soon!");

export default async ({ bot }: CommandArgs) => {
	bot.onApplicationCommand(command, (interaction: CommandInteraction) => {
		void interaction.reply({
			content: `This feature is a work in progress. It will offer a quick breakdown of how to use the bot and link to the website for more indepth information.`,
		});
	});
};
