import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { CommandArgs } from "../typedefs";

export const command = new SlashCommandBuilder()
	.setName("help")
	.setDescription("TODO");

export default async ({ bot }: CommandArgs) => {
	bot.onApplicationCommand(command, (interaction: CommandInteraction) => {
		void interaction.reply({
			content: `WIP`,
		});
	});
};
