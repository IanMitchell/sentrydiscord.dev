import { APIEmbedField, EmbedBuilder } from "discord.js";
import getColor from "./colors";
import * as parser from "./parser";
import dotenv from "dotenv";

dotenv.config(); // Загружаем переменные окружения

const NEXT_PUBLIC_WEBHOOK_HOST = process.env.NEXT_PUBLIC_WEBHOOK_HOST;
const NEXT_PUBLIC_WEBHOOK_PORT = process.env.NEXT_PUBLIC_WEBHOOK_PORT;

function cap(str: string, length: number) {
	if (str == null || str?.length <= length) {
		return str;
	}

	return str.substr(0, length - 1) + "\u2026";
}

export default function createMessage(event) {
	const embed = new EmbedBuilder()
		.setColor(getColor(parser.getLevel(event)))
		.setAuthor({
			name: event.project_name,
			iconURL: `${NEXT_PUBLIC_WEBHOOK_HOST}:${NEXT_PUBLIC_WEBHOOK_PORT}/icons/sentry.png`,
		})
		.setFooter({
			text: "Please consider sponsoring us!",
			iconURL: `${NEXT_PUBLIC_WEBHOOK_HOST}:${NEXT_PUBLIC_WEBHOOK_PORT}/sponsor.png`,
		})
		.setTimestamp(parser.getTime(event));

	const projectName = parser.getProject(event);

	const eventTitle = parser.getTitle(event);

	if (projectName) {
		const embedTitle = `[${projectName}] ${eventTitle}`;
		embed.setTitle(cap(embedTitle, 250));
	} else {
		embed.setTitle(cap(eventTitle, 250));
	}

	const link = parser.getLink(event);
	if (link.startsWith("https://") || link.startsWith("http://")) {
		embed.setURL(parser.getLink(event));
	}

	const fileLocation = parser.getFileLocation(event);
	const snippet = cap(parser.getErrorCodeSnippet(event), 3900);

	if (snippet) {
		embed.setDescription(
			`${fileLocation ? `\`📄 ${fileLocation.slice(-95)}\`\n` : ""}\`\`\`${
				parser.getLanguage(event) ?? parser.getPlatform(event)
			}\n${snippet}
      \`\`\``
		);
	} else {
		embed.setDescription("Unable to generate code snippet.");
	}

	const fields: APIEmbedField[] = [];

	const location = parser.getErrorLocation(event, 7);
	if (location?.length > 0) {
		fields.push({
			name: "Stack",
			value: `\`\`\`${cap(location.join("\n"), 1000)}\n\`\`\``,
		});
	}

	const user = parser.getUser(event);
	if (user?.username) {
		fields.push({
			name: "User",
			value: cap(`${user.username} ${user.id ? `(${user.id})` : ""}`, 1024),
			inline: true,
		});
	}

	const tags = parser.getTags(event);
	if (Object.keys(tags).length > 0) {
		fields.push({
			name: "Tags",
			value: cap(
				tags.map(([key, value]) => `${key}: ${value}`).join("\n"),
				1024
			),
			inline: true,
		});
	}

	const extras = parser.getExtras(event);
	if (extras.length > 0) {
		fields.push({
			name: "Extras",
			value: cap(extras.join("\n"), 1024),
			inline: true,
		});
	}

	const contexts = parser.getContexts(event);
	if (contexts.length > 0) {
		fields.push({
			name: "Contexts",
			value: cap(contexts.join("\n"), 1024),
			inline: true,
		});
	}

	const release = parser.getRelease(event);
	if (release) {
		fields.push({ name: "Release", value: cap(release, 1024), inline: true });
	}

	embed.addFields(fields);
	return {
		username: "Sentry",
		avatar_url: `${NEXT_PUBLIC_WEBHOOK_HOST}:${NEXT_PUBLIC_WEBHOOK_PORT}/icons/sentry.png`,
		embeds: [embed.toJSON()],
	};
}
