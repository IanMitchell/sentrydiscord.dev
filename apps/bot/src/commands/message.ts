import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { CommandArgs } from "../typedefs";

export const command = new SlashCommandBuilder()
	.setName("message")
	.setDescription("Coming soon!");

export default async ({ bot }: CommandArgs) => {
	bot.onApplicationCommand(command, (interaction: CommandInteraction) => {
		void interaction.reply({
			content: `This feature is a work in progress. It will let you set a message to be used when new events are posted (useful for pinging people!)`,
		});
	});
};
