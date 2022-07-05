import { MessageEmbed } from "discord.js";
import getColor from "./colors.js";
import * as parser from "./parser.js";

function cap(str, length) {
  if (str == null || str?.length <= length) {
    return str;
  }

  return str.substr(0, length - 1) + "\u2026";
}

export default function createMessage(event) {
  const embed = new MessageEmbed();

  embed.setAuthor("Sentry → Discord", "", "https://sentrydiscord.dev");

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

  embed.setTimestamp(parser.getTime(event));
  embed.setFooter({
    text: "Please consider sponsoring us!",
    iconURL: "https://sentrydiscord.dev/sponsor.png",
  });
  embed.setColor(getColor(parser.getLevel(event)));

  const fileLocation = parser.getFileLocation(event);

  const snippet = cap(parser.getErrorCodeSnippet(event), 3900);

  if (snippet) {
    embed.setDescription(
      `${fileLocation ? `\`📄 ${fileLocation}\`\n` : ""}\`\`\`${
        parser.getLanguage(event) ?? parser.getPlatform(event)
      }\n${snippet}
      \`\`\``
    );
  } else {
    embed.setDescription("Unable to generate code snippet.");
  }

  const location = parser.getErrorLocation(event, 7);
  if (location?.length > 0) {
    embed.addField("Stack", `\`\`\`${cap(location.join("\n"), 1000)}\n\`\`\``);
  }

  const user = parser.getUser(event);
  if (user?.username) {
    embed.addField(
      "User",
      cap(`${user.username} ${user.id ? `(${user.id})` : ""}`, 1024),
      true
    );
  }

  const tags = parser.getTags(event);
  if (Object.keys(tags).length > 0) {
    embed.addField(
      "Tags",
      cap(tags.map(([key, value]) => `${key}: ${value}`).join("\n"), 1024),
      true
    );
  }

  const extras = parser.getExtras(event);
  if (extras.length > 0) {
    embed.addField("Extras", cap(extras.join("\n"), 1024), true);
  }

  const contexts = parser.getContexts(event);
  if (contexts.length > 0) {
    embed.addField("Contexts", cap(contexts.join("\n"), 1024), true);
  }

  const release = parser.getRelease(event);
  if (release) {
    embed.addField("Release", cap(release, 1024), true);
  }

  return {
    username: "Sentry",
    avatar_url: `https://sentrydiscord.dev/icons/sentry.png`,
    embeds: [embed.toJSON()],
  };
}
