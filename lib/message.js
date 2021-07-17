import { MessageEmbed } from 'discord.js';
import getColor from './colors';
import * as parser from './parser';

function getLanguage(platform) {
  if (platform === 'node') {
    return 'javascript';
  }

  return platform;
}

function cap(str, length) {
  if (str == null || str?.length <= length) {
    return str;
  }

  return str.substr(0, length - 1) + '\u2026';
}

export default function createMessage(event) {
  const embed = new MessageEmbed();

  embed.setAuthor('Sentry → Discord', '', 'https://sentrydiscord.dev');

  embed.setTitle(cap(parser.getTitle(event), 255));
  embed.setURL(parser.getLink(event));
  embed.setTimestamp(parser.getTime(event));
  embed.setColor(getColor(parser.getLevel(event)));

  embed.setDescription(
    `\`\`\`${getLanguage(parser.getPlatform(event))}\n${cap(
      parser.getErrorCodeSnippet(event),
      4000
    )}
    \`\`\``
  );

  const location = parser.getErrorLocation(event, 7);
  embed.addField('Location', cap(location, 1024), true);

  const user = parser.getUser(event);
  if (user?.username) {
    embed.addField('**User**', cap(user.username, 1024), true);
  }

  const contexts = parser.getContexts(event);
  if (contexts.length > 0) {
    embed.addField('Contexts', cap(contexts.join('\n'), 1024));
  }

  const extras = parser.getExtras(event);
  if (extras.length > 0) {
    embed.addField('Extras', cap(extras.join('\n'), 1024));
  }

  const release = parser.getRelease(event);
  if (release != null) {
    embed.addField('Release', cap(release, 1024), true);
  }

  parser
    .getTags(event)
    ?.slice(0, 25 - embed.fields.length)
    ?.forEach(([key, value]) =>
      embed.addField(cap(key, 256), cap(value, 1024), true)
    );

  return {
    username: 'Sentry',
    avatar_url: `https://sentrydiscord.dev/icons/sentry.png`,
    embeds: [embed.toJSON()],
  };
}
