import { MessageEmbed } from 'discord.js';
import getColor from './colors.js';
import * as parser from './parser.js';

function cap(str, length) {
  if (str == null || str?.length <= length) {
    return str;
  }

  return str.substr(0, length - 1) + '\u2026';
}

export default function createMessage(event) {
  const embed = new MessageEmbed();

  embed.setAuthor('Sentry → Discord', '', 'https://sentrydiscord.dev');

  embed.setTitle(cap(parser.getTitle(event), 250));
  embed.setURL(parser.getLink(event));
  embed.setTimestamp(parser.getTime(event));
  embed.setColor(getColor(parser.getLevel(event)));

  const fileLocation = parser.getFileLocation(event);
  embed.setDescription(
    `${fileLocation ? `\`📄 ${fileLocation}\`\n` : ''}\`\`\`${
      parser.getLanguage(event) || parser.getPlatform(event)
    }\n${cap(parser.getErrorCodeSnippet(event), 3900)}
    \`\`\``
  );

  const location = parser.getErrorLocation(event, 7);
  embed.addField('Stack', `\`\`\`${cap(location.join('\n'), 1000)}\n\`\`\``);

  const tags = parser.getTags(event);
  if (Object.keys(tags).length > 0) {
    embed.addField(
      'Tags',
      cap(tags.map(([key, value]) => `${key}: ${value}`).join('\n'), 1024),
      true
    );
  }

  const user = parser.getUser(event);
  if (user?.username) {
    embed.addField(
      'User',
      cap(`${user.username} ${user.id ? `(${user.id})` : ''}`, 1024),
      true
    );
  }

  const contexts = parser.getContexts(event);
  if (contexts.length > 0) {
    embed.addField('Contexts', cap(contexts.join('\n'), 1024), true);
  }

  const release = parser.getRelease(event);
  if (release) {
    embed.addField('Release', `${release}`);
  }

  const extras = parser.getExtras(event);
  if (extras.length > 0) {
    embed.addField('Extras', cap(extras.join('\n'), 1024), true);
  }

  return {
    username: 'Sentry',
    avatar_url: `https://sentrydiscord.dev/icons/sentry.png`,
    embeds: [embed.toJSON()],
  };
}
