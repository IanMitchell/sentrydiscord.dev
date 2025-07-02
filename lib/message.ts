import { APIEmbedField, EmbedBuilder } from "discord.js";
import getColor from "./colors";
import * as legacyParser from "./legacyParser";
import * as parser from "./parser";

function cap(str: string, length: number) {
	if (str == null || str?.length <= length) {
		return str;
	}

	return str.substr(0, length - 1) + "\u2026";
}

export function createMessage(event) {
    console.debug("Received new event");

    console.debug({
        event: parser.getEvent(event),
        project: parser.getProject(event),
        platform: parser.getPlatform(event),
        language: parser.getLanguage(event),
        contexts: parser.getContexts(event),
        extras: parser.getExtras(event),
        link: parser.getLink(event),
        tags: parser.getTags(event),
        level: parser.getLevel(event),
        type: parser.getType(event),
        title: parser.getTitle(event),
        time: parser.getTime(event),
        user: parser.getUser(event),
        release: parser.getRelease(event),
        fileLocation: parser.getFileLocation(event),
        stackTrace: parser.getStacktrace(event),
        errorLocation: parser.getErrorLocation(event, 7),
        errorCodeSnippet: parser.getErrorCodeSnippet(event),
        message: parser.getMessage(event),
    });

	const embed = new EmbedBuilder()
		.setColor(getColor(parser.getLevel(event)))
		.setAuthor({
			name: event.data.triggered_rule,
			iconURL: "https://sentrydiscord.dev/icons/sentry.png",
		})
		.setFooter({
			text: "Please consider sponsoring us!",
			iconURL: "https://sentrydiscord.dev/sponsor.png",
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
		avatar_url: `https://sentrydiscord.dev/icons/sentry.png`,
		embeds: [embed.toJSON()],
	};
}

export function createLegacyMessage(event) {
    console.debug("Received legacy event");

    console.debug({
        event: legacyParser.getEvent(event),
        project: legacyParser.getProject(event),
        platform: legacyParser.getPlatform(event),
        language: legacyParser.getLanguage(event),
        contexts: legacyParser.getContexts(event),
        extras: legacyParser.getExtras(event),
        link: legacyParser.getLink(event),
        tags: legacyParser.getTags(event),
        level: legacyParser.getLevel(event),
        type: legacyParser.getType(event),
        title: legacyParser.getTitle(event),
        time: legacyParser.getTime(event),
        user: legacyParser.getUser(event),
        release: legacyParser.getRelease(event),
        fileLocation: legacyParser.getFileLocation(event),
        stackTrace: legacyParser.getStacktrace(event),
        errorLocation: legacyParser.getErrorLocation(event, 7),
        errorCodeSnippet: legacyParser.getErrorCodeSnippet(event),
        message: legacyParser.getMessage(event),
    });
	const embed = new EmbedBuilder()
		.setColor(getColor(legacyParser.getLevel(event)))
		.setAuthor({
			name: event.project_name,
			iconURL: "https://sentrydiscord.dev/icons/sentry.png",
		})
		.setFooter({
			text: "Please consider sponsoring us!",
			iconURL: "https://sentrydiscord.dev/sponsor.png",
		})
		.setTimestamp(legacyParser.getTime(event));

	const projectName = legacyParser.getProject(event);

	const eventTitle = legacyParser.getTitle(event);

	if (projectName) {
		const embedTitle = `[${projectName}] ${eventTitle}`;
		embed.setTitle(cap(embedTitle, 250));
	} else {
		embed.setTitle(cap(eventTitle, 250));
	}

	const link = legacyParser.getLink(event);
	if (link.startsWith("https://") || link.startsWith("http://")) {
		embed.setURL(legacyParser.getLink(event));
	}

	const fileLocation = legacyParser.getFileLocation(event);
	const snippet = cap(legacyParser.getErrorCodeSnippet(event), 3900);

	if (snippet) {
		embed.setDescription(
			`${fileLocation ? `\`📄 ${fileLocation.slice(-95)}\`\n` : ""}\`\`\`${
				legacyParser.getLanguage(event) ?? legacyParser.getPlatform(event)
			}\n${snippet}
      \`\`\``
		);
	} else {
		embed.setDescription("Unable to generate code snippet.");
	}

	const fields: APIEmbedField[] = [];

	const location = legacyParser.getErrorLocation(event, 7);
	if (location?.length > 0) {
		fields.push({
			name: "Stack",
			value: `\`\`\`${cap(location.join("\n"), 1000)}\n\`\`\``,
		});
	}

	const user = legacyParser.getUser(event);
	if (user?.username) {
		fields.push({
			name: "User",
			value: cap(`${user.username} ${user.id ? `(${user.id})` : ""}`, 1024),
			inline: true,
		});
	}

	const tags = legacyParser.getTags(event);
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

	const extras = legacyParser.getExtras(event);
	if (extras.length > 0) {
		fields.push({
			name: "Extras",
			value: cap(extras.join("\n"), 1024),
			inline: true,
		});
	}

	const contexts = legacyParser.getContexts(event);
	if (contexts.length > 0) {
		fields.push({
			name: "Contexts",
			value: cap(contexts.join("\n"), 1024),
			inline: true,
		});
	}

	const release = legacyParser.getRelease(event);
	if (release) {
		fields.push({ name: "Release", value: cap(release, 1024), inline: true });
	}

	embed.addFields(fields);
	return {
		username: "Sentry",
		avatar_url: `https://sentrydiscord.dev/icons/sentry.png`,
		embeds: [embed.toJSON()],
	};
}
