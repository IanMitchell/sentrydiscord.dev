import { MessageEmbed } from 'discord.js';
import getColor from './colors';
import * as parser from './parser';

function getLanguage(platform) {
  if (platform === 'node') {
    return 'javascript';
  }

  return platform;
}

export default function createMessage(event) {
  const embed = new MessageEmbed();

  embed.setAuthor('Sentry → Discord', '', 'https://sentrydiscord.dev');

  embed.setTitle(parser.getTitle(event));
  embed.setURL(parser.getLink(event));
  embed.setTimestamp(parser.getTime(event));
  embed.setColor(getColor(parser.getLevel(event)));

  embed.setDescription(
    `\`\`\`${getLanguage(
      parser.getPlatform(event)
    )}\n${parser.getErrorCodeSnippet(event)}
    \`\`\``
  );

  const location = parser.getErrorLocation(event);
  embed.addField('Location', location, true);

  const user = parser.getUser(event);
  if (user?.username) {
    embed.addField('**User**', user.username, true);
  }

  const contexts = parser.getContexts(event);
  if (contexts.length > 0) {
    embed.addField('Contexts', contexts.join('\n'));
  }

  const extras = parser.getExtras(event);
  if (extras.length > 0) {
    embed.addField('Extras', extras.join('\n'));
  }

  const release = parser.getRelease(event);
  if (release != null) {
    embed.addField('Release', release, true);
  }

  parser
    .getTags(event)
    .forEach(([key, value]) => embed.addField(key, value, true));

  return {
    username: 'Sentry',
    avatar_url: `https://sentrydiscord.dev/icons/sentry.png`,
    embeds: [embed.toJSON()],
  };
}
