import Sentry from "@sentry/node";
import { CaptureContext } from "@sentry/types";
import { DMChannel, Interaction, Message } from "discord.js";
import { Histogram } from "prom-client";
import { getException } from "../node/error";

const errorHistogram = new Histogram({
	name: "error_count",
	help: "Frequency of tracked errors",
});

function captureException(
	exception: any,
	captureContext?: CaptureContext
): string {
	errorHistogram.observe(1);
	return Sentry.captureException(exception, captureContext);
}

function getSentry() {
	if (process.env.NODE_ENV === "production") {
		Sentry.init({
			dsn: process.env.SENTRY,
			release: process.env.GIT_HASH,
		});
	}

	return {
		...Sentry,
		captureException,

		withMessageScope: (message: Message, fn: () => void) => {
			Sentry.withScope((scope) => {
				const { tag, id } = message.author;
				scope.setUser({ username: tag, id });

				if (message.guild) {
					scope.setExtra("Guild ID", message.guild.id);
					scope.setExtra("Guild Name", message.guild.name);
					scope.setExtra("Channel ID", message.channel.id);
					scope.setExtra("Channel Type", message.channel.type);

					if (
						message.channel.isText() &&
						!message.channel.partial &&
						!(message.channel instanceof DMChannel)
					) {
						scope.setExtra("Channel Name", message.channel.name);
					}
				}

				scope.setExtra("Message", message.content);
				scope.setExtra("Message ID", message.id);

				try {
					fn();
				} catch (err: unknown) {
					const error = getException(err);
					captureException(error);
				}
			});
		},

		withInteractionScope: (interaction: Interaction, fn: () => void) => {
			Sentry.withScope((scope) => {
				const { tag, id } = interaction.user;
				scope.setUser({ username: tag, id });

				if (interaction.guild) {
					scope.setExtra("Guild ID", interaction.guild.id);
					scope.setExtra("Guild Name", interaction.guild.name);
				}

				if (interaction.channel) {
					scope.setExtra("Channel ID", interaction.channel.id);
					scope.setExtra("Channel Type", interaction.channel.type);

					if (
						interaction.channel.isText() &&
						!interaction.channel.partial &&
						!(interaction.channel instanceof DMChannel)
					) {
						scope.setExtra("Channel Name", interaction.channel.name);
					}
				}

				try {
					fn();
				} catch (err: unknown) {
					const error = getException(err);
					captureException(error);
				}
			});
		},
	};
}

export default getSentry();
