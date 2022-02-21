import {
	Channel,
	Interaction,
	Message,
	DMChannel,
	PartialDMChannel,
} from "discord.js";

export function getChannelMeta(
	channel: PartialDMChannel | Channel | null
): Record<string, unknown> {
	if (channel == null) {
		return {};
	}

	const meta: Record<string, unknown> = {
		id: channel.id,
		type: channel.type,
	};

	if (channel.partial) {
		meta.partial = true;
		return meta;
	}

	/**
	 * TODO: In v14, switch to:
	 * channel.type !== Constants.ChannelTypes.DM
	 */
	if (channel.isText() && !(channel instanceof DMChannel)) {
		meta.name = channel.name;
	}

	return meta;
}

export function getMessageMeta(message: Message): Record<string, unknown> {
	return {
		guild: {
			id: message?.guild?.id,
			name: message?.guild?.name,
		},
		channel: getChannelMeta(message.channel),
		author: {
			id: message?.author?.id,
			name: message?.author?.username,
		},
		content: message?.cleanContent,
	};
}

export function getInteractionMeta(
	interaction: Interaction
): Record<string, unknown> {
	const meta: Record<string, unknown> = {
		guild: {
			id: interaction?.guildId,
			name: interaction?.guild?.name,
		},
		channel: getChannelMeta(interaction.channel),
		author: {
			id: interaction?.user?.id,
			name: interaction?.user?.username,
		},
	};

	// TODO: clean this up
	if (interaction.isCommand()) {
		meta.type = "command";
		meta.options = interaction.options?.data?.map((option) => ({
			name: option.name,
			value: option.value,
		}));
	}

	if (interaction.isButton()) {
		meta.type = "button";
		meta.customId = interaction.customId;
	}

	return meta;
}
